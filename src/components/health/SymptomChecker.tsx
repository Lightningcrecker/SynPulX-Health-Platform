import React, { useState } from 'react';
import { Activity, AlertCircle, Search } from 'lucide-react';
import { symptoms, symptomCategories } from '../../services/data/medicalData';
import { SymptomAnalyzer } from '../../services/ai/SymptomAnalyzer';

export const SymptomChecker: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const symptomAnalyzer = new SymptomAnalyzer();

  const filteredSymptoms = symptoms.filter(symptom => {
    const matchesSearch = symptom.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || symptom.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;
    const results = symptomAnalyzer.analyzeSymptoms(selectedSymptoms);
    setAnalysis(results);
  };

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="flex items-center mb-6">
        <Activity className="h-6 w-6 text-blue-400 mr-2" />
        <h3 className="text-xl font-semibold text-white">Symptom Checker</h3>
      </div>

      <div className="space-y-6">
        {/* Search and Category Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search symptoms..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === 'All'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              All
            </button>
            {symptomCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Symptom Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredSymptoms.map(symptom => (
            <button
              key={symptom.id}
              onClick={() => handleSymptomToggle(symptom.id)}
              className={`p-3 rounded-lg text-left ${
                selectedSymptoms.includes(symptom.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {symptom.name}
            </button>
          ))}
        </div>

        <button
          onClick={analyzeSymptoms}
          disabled={selectedSymptoms.length === 0}
          className="w-full p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Symptoms
        </button>

        {analysis && (
          <div className="space-y-6">
            {/* Possible Conditions */}
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-lg font-medium text-white mb-4">Possible Conditions</h4>
              <div className="space-y-3">
                {analysis.possibleConditions.map((condition: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{condition.name}</span>
                    <span className="text-blue-400">{condition.probability}% match</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-lg font-medium text-white mb-4">Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Severity Warning */}
            {analysis.severity === 'severe' && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-lg font-medium text-red-400">Seek Medical Attention</h4>
                  <p className="text-red-300">
                    Based on your symptoms, we recommend consulting a healthcare professional immediately.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};