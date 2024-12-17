import { loadStripe, Stripe } from '@stripe/stripe-js';

export class PaymentService {
  private static instance: PaymentService;
  private stripe: Promise<Stripe | null>;

  private constructor() {
    this.stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createSubscription(priceId: string): Promise<{ clientSecret: string }> {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const data = await response.json();
    return data;
  }

  async handlePayment(clientSecret: string): Promise<{ status: string; error?: string }> {
    const stripe = await this.stripe;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
    if (error) {
      return { status: 'error', error: error.message };
    }

    return { status: paymentIntent?.status || 'succeeded' };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    return response.ok;
  }
}