interface ReportData {
  metrics: any;
  date: string;
  recommendations: string[];
}

export const generatePDF = async (data: ReportData): Promise<void> => {
  // In a real implementation, use a PDF library like pdfmake
  // For demo, create and download a text file
  const content = `
    SynPulX Health Report
    Date: ${new Date(data.date).toLocaleDateString()}
    
    Weekly Metrics:
    - Heart Rate (avg): ${data.metrics.heartRate} BPM
    - Steps: ${data.metrics.steps}
    - Sleep Score: ${data.metrics.sleepScore}
    
    Recommendations:
    ${data.recommendations.map(rec => `- ${rec}`).join('\n')}
  `;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `health-report-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};