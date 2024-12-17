import { PaymentProcessor } from '../payment/PaymentProcessor';
import { SecureStorage } from '../encryption/SecureStorage';

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private secureStorage: SecureStorage;
  private paymentProcessor: PaymentProcessor;

  private readonly PLANS = [
    {
      id: 'free',
      name: 'Free',
      features: [
        'Basic health metrics tracking',
        'Limited symptom analysis',
        'Basic AI insights'
      ],
      price: 0
    },
    {
      id: 'premium',
      name: 'Premium',
      features: [
        'Advanced health analytics',
        'Unlimited symptom analysis',
        'Advanced AI insights',
        'Google Drive backup',
        'Priority support',
        'Ad-free experience'
      ],
      price: 9.99
    }
  ];

  private constructor() {
    this.secureStorage = SecureStorage.getInstance();
    this.paymentProcessor = PaymentProcessor.getInstance();
  }

  public static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  async getCurrentPlan(userId: string): Promise<any> {
    const subscription = this.secureStorage.getItem(`subscription_${userId}`);
    return subscription?.planId === 'premium' ? this.PLANS[1] : this.PLANS[0];
  }

  isFeatureAvailable(userId: string, feature: string): boolean {
    const subscription = this.secureStorage.getItem(`subscription_${userId}`);
    return subscription?.planId === 'premium' || this.PLANS[0].features.includes(feature);
  }

  async upgradeToPremium(userId: string, paymentMethodId: string): Promise<boolean> {
    try {
      const result = await this.paymentProcessor.processSubscription(
        'premium_monthly',
        paymentMethodId,
        userId
      );

      if (result.success) {
        this.secureStorage.setItem(`subscription_${userId}`, {
          planId: 'premium',
          subscriptionId: result.subscriptionId,
          startDate: Date.now()
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      return false;
    }
  }
}