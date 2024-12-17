import React from 'react';
import { useSubscription } from '@hooks/useSubscription';
import { useAuth } from '@contexts/AuthContext';

export const AdBanner: React.FC = () => {
  const { user } = useAuth();
  const { checkFeatureAccess } = useSubscription();
  const isAdFree = user ? checkFeatureAccess('ad-free') : false;

  if (isAdFree) return null;

  return (
    <div className="fixed bottom-4 left-4 w-[300px] h-[250px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
      />
    </div>
  );
};