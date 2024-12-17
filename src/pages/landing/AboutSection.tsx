import React from 'react';
import { Award, Users, Globe, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const stats = [
    { label: 'Active Users', value: '100K+' },
    { label: 'Health Insights Generated', value: '1M+' },
    { label: 'Countries', value: '50+' },
    { label: 'Accuracy Rate', value: '99.9%' }
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Revolutionizing Personal Health Monitoring
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              SynPulX was founded with a vision to make advanced health monitoring accessible to everyone. Our platform combines cutting-edge technology with user-friendly design to help you take control of your health journey.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: Award,
                title: 'Award-Winning Platform',
                description: 'Recognized for innovation in digital health monitoring and data privacy.'
              },
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Built by a team of healthcare professionals, data scientists, and security experts.'
              },
              {
                icon: Globe,
                title: 'Global Impact',
                description: 'Making advanced health monitoring accessible to users worldwide.'
              },
              {
                icon: Sparkles,
                title: 'Continuous Innovation',
                description: 'Constantly evolving with the latest advancements in health technology.'
              }
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <item.icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};