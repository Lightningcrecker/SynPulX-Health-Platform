import { StripeService } from './StripeService';
import { SecureStorage } from '../encryption/SecureStorage';

export class PaymentProcessor {
  private static instance: PaymentProcessor;
  private stripeService: StripeService;
  private secureStorage: SecureStorage;

  private constructor() {
    this.stripeService = StripeService.getInstance();
    this.secureStorage = SecureStorage.getInstance();
  }

  public static getInstance(): PaymentProcessor {
    if (!PaymentProcessor.instance) {
      PaymentProcessor.instance = new PaymentProcessor();
    }
    return PaymentProcessor.instance;
  }

  async processSubscription(
    priceId: string,
    paymentMethodId: string,
    userId: string
  ): Promise<{
    success: boolean;
    subscriptionId?: string;
    error?: string;
  }> {
    try {
      // Create subscription
      const { clientSecret, subscriptionId } = await this.stripeService.createSubscription(priceId);

      // Confirm payment
      const result = await this.stripeService.handlePaymentConfirmation(clientSecret);

      if (result.status === 'succeeded') {
        // Store subscription info securely
        this.secureStorage.setItem(`subscription_${userId}`, {
          id: subscriptionId,
          priceId,
          status: 'active',
          startDate: Date.now()
        });

        return { success: true, subscriptionId };
      }

      return { success: false, error: 'Payment confirmation failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.stripeService.cancelSubscription(subscriptionId);
      
      // Update stored subscription info
      const subscription = this.secureStorage.getItem(`subscription_${userId}`);
      if (subscription) {
        subscription.status = 'cancelled';
        subscription.endDate = Date.now();
        this.secureStorage.setItem(`subscription_${userId}`, subscription);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cancellation failed'
      };
    }
  }

  async updateSubscription(
    subscriptionId: string,
    newPriceId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.stripeService.updateSubscription(subscriptionId, newPriceId);
      
      // Update stored subscription info
      const subscription = this.secureStorage.getItem(`subscription_${userId}`);
      if (subscription) {
        subscription.priceId = newPriceId;
        subscription.updateDate = Date.now();
        this.secureStorage.setItem(`subscription_${userId}`, subscription);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed'
      };
    }
  }
}