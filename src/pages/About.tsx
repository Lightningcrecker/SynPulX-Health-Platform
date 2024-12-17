import React from 'react';
import { Navbar } from '../components/shared/Navbar';
import { Award, Users, Globe, Sparkles, Shield as ShieldIcon } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { label: 'Active Users', value: '100K+' },
    { label: 'Health Insights Generated', value: '1M+' },
    { label: 'Countries', value: '50+' },
    { label: 'Accuracy Rate', value: '99.9%' }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Medical Officer',
      bio: 'Former Head of Digital Health at Stanford Medical'
    },
    {
      name: 'Alex Rivera',
      role: 'Chief Technology Officer',
      bio: 'AI researcher with 15+ years in healthcare technology'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Empowering individuals to take control of their health through innovative technology and data-driven insights.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="prose prose-invert">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Founded in 2023, SynPulX emerged from a simple yet powerful idea: making advanced health monitoring accessible to everyone. Our team of healthcare professionals, data scientists, and technology experts came together with a shared vision of revolutionizing personal health management.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Today, we're proud to serve users worldwide, helping them make informed decisions about their health through our innovative platform that combines cutting-edge technology with user-friendly design.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: ShieldIcon,
                  title: 'User-Centric',
                  description: 'Built with users in mind, focusing on accessibility and ease of use.'
                },
                {
                  icon: Award,
                  title: 'Privacy-First',
                  description: 'Your health data security and privacy are our top priorities.'
                }
              ].map((value) => (
                <div key={value.title} className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <value.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-white mb-1 text-center">{member.name}</h3>
                  <p className="text-blue-400 mb-3 text-center">{member.role}</p>
                  <p className="text-gray-400 text-center">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};