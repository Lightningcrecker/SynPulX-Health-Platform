import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';
import { useToaster } from '../../components/shared/Toaster';
import { CreditCard, Shield, Check } from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const navigate = useNavigate();
  const { upgradeToPremium } = useSubscription();
  const { showToast } = useToaster();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const success = await upgradeToPremium({
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiry,
        cvc
      });

      if (success) {
        showToast('Payment successful! Upgrading your account...', 'success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        showToast('Payment failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('An error occurred during payment', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold text-white">Upgrade to Premium</h2>
          <p className="mt-2 text-gray-400">Unlock all premium features</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="card-number" className="sr-only">Card number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="card-number"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card number"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={19}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="sr-only">Expiry date</label>
                <input
                  id="expiry"
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={5}
                />
              </div>

              <div>
                <label htmlFor="cvc" className="sr-only">CVC</label>
                <input
                  id="cvc"
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="CVC"
                  className="block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                Pay $9.99/month
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};