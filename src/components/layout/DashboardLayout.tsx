import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart2, Heart, Settings, User } from 'lucide-react';
import { Logo } from '../shared/Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', icon: Activity, href: '/dashboard' },
    { name: 'Health Metrics', icon: Heart, href: '/health' },
    { name: 'Analytics', icon: BarChart2, href: '/analytics' },
    { name: 'Profile', icon: User, href: '/profile' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-white/10">
                <Logo />
              </div>
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};