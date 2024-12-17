import React, { useState } from 'react';
import { Upload, FileText, Check, AlertTriangle } from 'lucide-react';
import { useMedicalReport } from '../../hooks/useMedicalReport';

export const MedicalReportUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { analyzeReport, isAnalyzing, analysis } = useMedicalReport();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    await analyzeReport(file);
  };

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-blue-400 mr-2" />
        <h3 className="text-xl font-semibold text-white">Medical Report Analysis</h3>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-300 mb-2">
              {file ? file.name : 'Drop your medical report here'}
            </p>
            <p className="text-sm text-gray-400">
              Supports PDF, Images, and Documents
            </p>
          </label>
        </div>

        {file && (
          <button
            onClick={handleUpload}
            disabled={isAnalyzing}
            className="w-full p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Analyzing Report...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Analyze Report
              </>
            )}
          </button>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* WHO Standard Categories */}
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-lg font-medium text-white mb-4">Clinical Findings</h4>
              <div className="space-y-3">
                {analysis.findings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400">•</span>
                    {finding}
                  </div>
                ))}
              </div>
            </div>

            {/* Vital Signs */}
            {analysis.vitals && (
              <div className="p-4 rounded-lg bg-white/5">
                <h4 className="text-lg font-medium text-white mb-4">Vital Signs</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysis.vitals).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400">{key}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Assessment */}
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-lg font-medium text-white mb-4">Risk Assessment</h4>
              <div className="space-y-3">
                {analysis.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-lg font-medium text-white mb-4">Medical Recommendations</h4>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up Care */}
            {analysis.followUp && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="text-lg font-medium text-blue-400 mb-2">Follow-up Care</h4>
                <p className="text-gray-300">{analysis.followUp}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};