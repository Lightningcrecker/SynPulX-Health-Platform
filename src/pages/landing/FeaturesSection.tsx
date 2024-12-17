import React from 'react';
import { Brain, Shield, Activity, Heart, Zap, Users, Cloud, Lock } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms analyze your health data to provide personalized recommendations and predictions.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data is encrypted and stored locally. We prioritize your privacy with end-to-end encryption.'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Track your vital signs and health metrics in real-time with support for various wearable devices.'
    },
    {
      icon: Heart,
      title: 'Comprehensive Health Tracking',
      description: 'Monitor everything from heart rate and sleep patterns to activity levels and nutrition.'
    },
    {
      icon: Zap,
      title: 'Smart Alerts',
      description: 'Receive intelligent notifications about potential health concerns and wellness recommendations.'
    },
    {
      icon: Users,
      title: 'Healthcare Integration',
      description: 'Seamlessly share your health data with healthcare providers for better care coordination.'
    },
    {
      icon: Cloud,
      title: 'Secure Cloud Backup',
      description: 'Optional encrypted cloud backup ensures your health data is never lost.'
    },
    {
      icon: Lock,
      title: 'Data Control',
      description: 'Full control over your data with easy export and deletion options.'
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features for Your Health
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to monitor and improve your health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors group"
            >
              <feature.icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};