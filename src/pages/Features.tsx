import React from 'react';
import { Navbar } from '../components/shared/Navbar';
import { Brain, Shield as ShieldIcon, Activity, Heart, Zap, Users, Cloud, Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms analyze your health data to provide personalized recommendations and predictions.',
      details: [
        'Real-time health analysis',
        'Personalized recommendations',
        'Predictive health insights',
        'Trend analysis'
      ]
    },
    {
      icon: ShieldIcon,
      title: 'Privacy First',
      description: 'Your health data is encrypted and stored locally. We prioritize your privacy with end-to-end encryption.',
      details: [
        'End-to-end encryption',
        'Local data storage',
        'Secure data sharing',
        'HIPAA compliance'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Powerful Features for Your Health Journey
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of health monitoring with our comprehensive suite of features
            </p>
          </div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <div key={feature.title} className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className="flex-1">
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10">
                    <feature.icon className="w-16 h-16 text-blue-400 mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">{feature.title}</h2>
                    <p className="text-gray-300 mb-6 text-lg">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-gray-300">
                          <ChevronRight className="w-5 h-5 text-blue-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex-1 p-8 rounded-2xl bg-white/5 border border-white/10">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};