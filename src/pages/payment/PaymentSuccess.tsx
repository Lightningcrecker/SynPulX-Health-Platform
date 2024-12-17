import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-2xl">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
          <p className="text-gray-300 mb-8">
            Thank you for upgrading to Premium. Your account has been upgraded successfully.
          </p>
          <p className="text-gray-400 text-sm">
            Redirecting you to the dashboard...
          </p>
        </div>
      </div>
    </div>
  );
};