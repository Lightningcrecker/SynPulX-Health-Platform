import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Shield, Lock, Database, Eye, Server, Key } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-gray-400">
            Your privacy is our top priority. Learn how we protect your data.
          </p>
        </header>

        <div className="space-y-8">
          {[
            {
              icon: Lock,
              title: "Data Encryption",
              content: "All your health data is encrypted using military-grade AES-256 encryption. Your data is encrypted both in transit and at rest, ensuring maximum security."
            },
            {
              icon: Database,
              title: "Local Storage",
              content: "Your health data is primarily stored locally on your device. We use secure Web Storage APIs and IndexedDB for efficient and secure local data management."
            },
            {
              icon: Eye,
              title: "Data Access",
              content: "Only you have access to your complete health data. Our AI processing is done locally on your device whenever possible to maintain privacy."
            },
            {
              icon: Server,
              title: "Cloud Sync",
              content: "If you choose to enable cloud sync, your data is end-to-end encrypted before being transmitted to our servers. We never store your encryption keys."
            },
            {
              icon: Key,
              title: "Authentication",
              content: "We use secure authentication methods and never store plain-text passwords. All sessions are encrypted and automatically expire for your security."
            }
          ].map((section, index) => (
            <div key={index} className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <section.icon className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Your Rights</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Right to access your personal data
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Right to rectification of inaccurate data
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Right to erasure ("right to be forgotten")
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Right to data portability
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Right to withdraw consent
              </li>
            </ul>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>Contact us at privacy@synpulx.com for any privacy-related questions.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};