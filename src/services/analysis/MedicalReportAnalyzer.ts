import * as tf from '@tensorflow/tfjs';
import { WHOStandards } from '../data/whoStandards';

interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

interface AnalysisResult {
  findings: string[];
  vitals: VitalSigns;
  riskFactors: string[];
  recommendations: string[];
  followUp: string;
  metrics: {
    severity: 'low' | 'moderate' | 'high';
    confidence: number;
    urgency: 'routine' | 'soon' | 'immediate';
  };
}

export class MedicalReportAnalyzer {
  private model: tf.LayersModel | null = null;

  async analyzeReport(file: File): Promise<AnalysisResult> {
    const text = await this.extractText(file);
    const sections = this.parseSections(text);
    
    const vitals = this.extractVitalSigns(sections.vitals || '');
    const findings = this.analyzeClinicalFindings(sections.findings || '');
    const risks = this.assessRiskFactors(sections, vitals);
    const recommendations = this.generateRecommendations(findings, risks, vitals);
    
    const metrics = this.calculateMetrics(findings, risks, vitals);
    const followUp = this.determineFollowUp(metrics);

    return {
      findings: findings.map(f => f.description),
      vitals,
      riskFactors: risks.map(r => r.description),
      recommendations,
      followUp,
      metrics
    };
  }

  private async extractText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private parseSections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const sectionPatterns = [
      { name: 'vitals', pattern: /vital signs:?(.*?)(?=\n\n|\n[A-Z]|$)/is },
      { name: 'findings', pattern: /findings:?(.*?)(?=\n\n|\n[A-Z]|$)/is },
      { name: 'history', pattern: /history:?(.*?)(?=\n\n|\n[A-Z]|$)/is },
      { name: 'medications', pattern: /medications?:?(.*?)(?=\n\n|\n[A-Z]|$)/is }
    ];

    sectionPatterns.forEach(({ name, pattern }) => {
      const match = text.match(pattern);
      if (match) sections[name] = match[1].trim();
    });

    return sections;
  }

  private extractVitalSigns(vitalsText: string): VitalSigns {
    const defaults: VitalSigns = {
      bloodPressure: 'Not recorded',
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0,
      oxygenSaturation: 0
    };

    const patterns = {
      bloodPressure: /BP:?\s*(\d{2,3}\/\d{2,3})/i,
      heartRate: /HR:?\s*(\d{2,3})/i,
      temperature: /Temp:?\s*(\d{2,3}(?:\.\d)?)/i,
      respiratoryRate: /RR:?\s*(\d{1,2})/i,
      oxygenSaturation: /O2:?\s*(\d{1,3}%?)/i
    };

    return Object.entries(patterns).reduce((acc, [key, pattern]) => {
      const match = vitalsText.match(pattern);
      if (match) {
        acc[key as keyof VitalSigns] = match[1];
      }
      return acc;
    }, defaults);
  }

  private analyzeClinicalFindings(findingsText: string): Array<{
    description: string;
    severity: string;
    system: string;
  }> {
    const findings: Array<{
      description: string;
      severity: string;
      system: string;
    }> = [];

    const sentences = findingsText.split(/[.!?]+/).filter(s => s.trim());
    
    sentences.forEach(sentence => {
      const system = this.determineBodySystem(sentence);
      const severity = this.determineSeverity(sentence);
      
      findings.push({
        description: sentence.trim(),
        severity,
        system
      });
    });

    return findings;
  }

  private determineBodySystem(text: string): string {
    const systemPatterns = WHOStandards.bodySystems.map(system => ({
      name: system.name,
      patterns: system.keywords
    }));

    for (const { name, patterns } of systemPatterns) {
      if (patterns.some(pattern => text.toLowerCase().includes(pattern))) {
        return name;
      }
    }

    return 'General';
  }

  private determineSeverity(text: string): string {
    const severityIndicators = {
      high: ['severe', 'critical', 'extreme', 'significant'],
      moderate: ['moderate', 'mild to moderate', 'concerning'],
      low: ['mild', 'minimal', 'slight']
    };

    for (const [severity, indicators] of Object.entries(severityIndicators)) {
      if (indicators.some(indicator => text.toLowerCase().includes(indicator))) {
        return severity;
      }
    }

    return 'moderate';
  }

  private assessRiskFactors(
    sections: Record<string, string>,
    vitals: VitalSigns
  ): Array<{ description: string; priority: string }> {
    const risks: Array<{ description: string; priority: string }> = [];

    // Assess vital signs
    this.assessVitalSignRisks(vitals, risks);

    // Assess medical history
    if (sections.history) {
      this.assessHistoryRisks(sections.history, risks);
    }

    // Assess medications
    if (sections.medications) {
      this.assessMedicationRisks(sections.medications, risks);
    }

    return risks;
  }

  private assessVitalSignRisks(
    vitals: VitalSigns,
    risks: Array<{ description: string; priority: string }>
  ): void {
    const { vitalSignRanges } = WHOStandards;

    // Blood pressure assessment
    if (vitals.bloodPressure !== 'Not recorded') {
      const [systolic, diastolic] = vitals.bloodPressure.split('/').map(Number);
      if (systolic > vitalSignRanges.bloodPressure.systolic.high) {
        risks.push({
          description: 'Elevated systolic blood pressure',
          priority: 'high'
        });
      }
    }

    // Other vital sign assessments...
  }

  private assessHistoryRisks(
    history: string,
    risks: Array<{ description: string; priority: string }>
  ): void {
    const { riskConditions } = WHOStandards;

    riskConditions.forEach(condition => {
      if (history.toLowerCase().includes(condition.keyword)) {
        risks.push({
          description: condition.riskDescription,
          priority: condition.priority
        });
      }
    });
  }

  private assessMedicationRisks(
    medications: string,
    risks: Array<{ description: string; priority: string }>
  ): void {
    const { medicationInteractions } = WHOStandards;

    medicationInteractions.forEach(interaction => {
      const medications = interaction.medications;
      if (medications.every(med => 
        medications.toLowerCase().includes(med.toLowerCase())
      )) {
        risks.push({
          description: interaction.riskDescription,
          priority: interaction.priority
        });
      }
    });
  }

  private generateRecommendations(
    findings: Array<{ description: string; severity: string; system: string }>,
    risks: Array<{ description: string; priority: string }>,
    vitals: VitalSigns
  ): string[] {
    const recommendations = new Set<string>();

    // Add recommendations based on findings
    findings.forEach(finding => {
      const systemRecs = WHOStandards.recommendations[finding.system] || [];
      systemRecs.forEach(rec => recommendations.add(rec));
    });

    // Add recommendations based on risks
    risks.forEach(risk => {
      if (risk.priority === 'high') {
        recommendations.add('Urgent medical consultation recommended');
      }
    });

    // Add vital sign based recommendations
    this.addVitalSignRecommendations(vitals, recommendations);

    return Array.from(recommendations);
  }

  private addVitalSignRecommendations(
    vitals: VitalSigns,
    recommendations: Set<string>
  ): void {
    const { vitalSignRanges } = WHOStandards;

    if (vitals.bloodPressure !== 'Not recorded') {
      const [systolic] = vitals.bloodPressure.split('/').map(Number);
      if (systolic > vitalSignRanges.bloodPressure.systolic.high) {
        recommendations.add('Regular blood pressure monitoring recommended');
        recommendations.add('Consider lifestyle modifications for blood pressure management');
      }
    }

    // Add more vital sign specific recommendations...
  }

  private calculateMetrics(
    findings: Array<{ severity: string }>,
    risks: Array<{ priority: string }>,
    vitals: VitalSigns
  ): {
    severity: 'low' | 'moderate' | 'high';
    confidence: number;
    urgency: 'routine' | 'soon' | 'immediate';
  } {
    const severityScore = this.calculateSeverityScore(findings, risks);
    const confidence = this.calculateConfidence(findings, vitals);
    const urgency = this.determineUrgency(severityScore, risks);

    return {
      severity: severityScore > 7 ? 'high' : severityScore > 4 ? 'moderate' : 'low',
      confidence,
      urgency
    };
  }

  private calculateSeverityScore(
    findings: Array<{ severity: string }>,
    risks: Array<{ priority: string }>
  ): number {
    const severityWeights = { high: 3, moderate: 2, low: 1 };
    const priorityWeights = { high: 3, moderate: 2, low: 1 };

    const findingsScore = findings.reduce((score, finding) => 
      score + severityWeights[finding.severity as keyof typeof severityWeights], 0
    );

    const risksScore = risks.reduce((score, risk) =>
      score + priorityWeights[risk.priority as keyof typeof priorityWeights], 0
    );

    return (findingsScore + risksScore) / (findings.length + risks.length);
  }

  private calculateConfidence(
    findings: Array<{ severity: string }>,
    vitals: VitalSigns
  ): number {
    let confidence = 70; // Base confidence

    // Adjust based on findings
    confidence += findings.length * 5;

    // Adjust based on vital signs
    if (vitals.bloodPressure !== 'Not recorded') confidence += 10;
    if (vitals.heartRate) confidence += 5;
    if (vitals.temperature) confidence += 5;

    return Math.min(confidence, 100);
  }

  private determineUrgency(
    severityScore: number,
    risks: Array<{ priority: string }>
  ): 'routine' | 'soon' | 'immediate' {
    const hasHighPriorityRisks = risks.some(risk => risk.priority === 'high');
    
    if (hasHighPriorityRisks || severityScore > 7) return 'immediate';
    if (severityScore > 4) return 'soon';
    return 'routine';
  }

  private determineFollowUp(metrics: {
    severity: string;
    urgency: string;
  }): string {
    if (metrics.urgency === 'immediate') {
      return 'Immediate medical attention required. Please seek emergency care.';
    }

    if (metrics.urgency === 'soon') {
      return 'Schedule follow-up appointment within 48-72 hours.';
    }

    return 'Schedule routine follow-up within 2 weeks.';
  }
}