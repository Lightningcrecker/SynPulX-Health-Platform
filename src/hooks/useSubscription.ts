import { useState, useCallback } from 'react';
import { SubscriptionManager } from '../services/subscription/SubscriptionManager';
import { useAuth } from '../contexts/AuthContext';
import { useToaster } from '../components/shared/Toaster';

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToaster();
  const subscriptionManager = SubscriptionManager.getInstance();

  const upgradeToPremium = useCallback(async (paymentMethodId: string) => {
    if (!user) {
      showToast('Please log in to upgrade', 'error');
      return false;
    }

    setIsLoading(true);
    try {
      const success = await subscriptionManager.upgradeToPremium(
        user.id,
        paymentMethodId
      );

      if (success) {
        showToast('Successfully upgraded to Premium!', 'success');
      } else {
        showToast('Failed to upgrade subscription', 'error');
      }

      return success;
    } catch (error) {
      showToast('An error occurred during upgrade', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, showToast]);

  const checkFeatureAccess = useCallback((feature: string) => {
    if (!user) return false;
    return subscriptionManager.isFeatureAvailable(user.id, feature);
  }, [user]);

  return {
    upgradeToPremium,
    checkFeatureAccess,
    isLoading
  };
};