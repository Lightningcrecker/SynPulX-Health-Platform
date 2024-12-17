import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Settings as SettingsIcon, Bell, Shield, Palette, Activity, Watch, Upload } from 'lucide-react';
import { WearableDeviceModal } from '../../components/settings/WearableDeviceModal';

export const Settings: React.FC = () => {
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Customize your experience
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wearable Devices */}
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center mb-6">
              <Watch className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Connected Devices</h3>
            </div>
            <button
              onClick={() => setIsWearableModalOpen(true)}
              className="w-full p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <Activity className="h-5 w-5" />
              Connect Wearable Device
            </button>
          </div>

          {/* General Settings */}
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center mb-6">
              <SettingsIcon className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                <select className="block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Time Zone</label>
                <select className="block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Goals */}
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center mb-6">
              <Activity className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Health Goals</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Daily Step Goal</label>
                <input
                  type="number"
                  className="block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Sleep Goal (hours)</label>
                <input
                  type="number"
                  className="block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="8"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center mb-6">
              <Palette className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Theme Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {['blue', 'purple', 'green', 'pink'].map((color) => (
                    <button
                      key={color}
                      className={`w-full aspect-square rounded-lg border-2 border-white/20 ${
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'green' ? 'bg-green-500' :
                        'bg-pink-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <WearableDeviceModal
          isOpen={isWearableModalOpen}
          onClose={() => setIsWearableModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};