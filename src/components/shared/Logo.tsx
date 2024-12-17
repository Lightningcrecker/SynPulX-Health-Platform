import React from 'react';
import { DnaIcon } from 'lucide-react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative group">
        <DnaIcon className="w-10 h-10 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 blur-lg opacity-75">
          <DnaIcon className="w-10 h-10 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        SynPulX
      </span>
    </div>
  );
};