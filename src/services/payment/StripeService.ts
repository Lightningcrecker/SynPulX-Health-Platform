import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

export class StripeService {
  private static instance: StripeService;
  private stripe: Promise<Stripe | null>;
  private elements: StripeElements | null = null;

  private constructor() {
    this.stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async createSubscription(priceId: string): Promise<{
    clientSecret: string;
    subscriptionId: string;
  }> {
    const response = await fetch('/api/subscriptions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    return response.json();
  }

  async updateSubscription(subscriptionId: string, newPriceId: string): Promise<void> {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: newPriceId })
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
  }

  async createPaymentMethod(paymentMethodData: any): Promise<string> {
    const stripe = await this.stripe;
    if (!stripe) throw new Error('Stripe not initialized');

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: paymentMethodData.card,
      billing_details: paymentMethodData.billingDetails
    });

    if (error) throw error;
    return paymentMethod!.id;
  }

  async handlePaymentConfirmation(clientSecret: string): Promise<{
    status: string;
    paymentIntentId?: string;
    error?: string;
  }> {
    const stripe = await this.stripe;
    if (!stripe) throw new Error('Stripe not initialized');

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret);

    if (error) {
      return {
        status: 'failed',
        error: error.message
      };
    }

    return {
      status: paymentIntent!.status,
      paymentIntentId: paymentIntent!.id
    };
  }
}