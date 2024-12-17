import React from 'react';
import { ArrowRight, Shield as ShieldIcon, Brain, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../shared/Logo';

export const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-purple-900/10" />
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="mb-12">
          <Logo className="justify-center scale-150 mb-8" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Syncing Lives with Precision & Privacy
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-gray-300">
          Experience the future of health analytics with uncompromising privacy and AI-powered insights
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <Link
            to="/signup"
            className="group relative inline-flex items-center px-8 py-3 text-lg font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden transition-all duration-300 hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <button
            onClick={() => scrollToSection('features')}
            className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-full border-2 border-gray-500 text-gray-300 hover:border-gray-400 hover:text-white transition-colors duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Features grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            {
              icon: ShieldIcon,
              title: 'Privacy First',
              description: 'Your data stays on your device, encrypted and secure'
            },
            {
              icon: Brain,
              title: 'AI Insights',
              description: 'Advanced analytics powered by cutting-edge AI'
            },
            {
              icon: Activity,
              title: 'Health Analytics',
              description: 'Comprehensive health tracking and visualization'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};