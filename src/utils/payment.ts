import { StripeService } from '../services/payment/StripeService';

export interface PaymentResult {
  success: boolean;
  error?: string;
  transactionId?: string;
}

export const processPayment = async (
  amount: number,
  currency: string,
  paymentMethod: string
): Promise<PaymentResult> => {
  try {
    const stripeService = StripeService.getInstance();
    const result = await stripeService.handlePaymentConfirmation(paymentMethod);
    
    return {
      success: result.status === 'succeeded',
      transactionId: result.paymentIntentId
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    };
  }
};

export const validatePaymentMethod = (
  cardNumber: string,
  expiryDate: string,
  cvc: string
): { valid: boolean; error?: string } => {
  // Basic validation
  if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
    return { valid: false, error: 'Invalid card number' };
  }

  const [month, year] = expiryDate.split('/');
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (
    !month ||
    !year ||
    parseInt(year) < currentYear ||
    (parseInt(year) === currentYear && parseInt(month) < currentMonth)
  ) {
    return { valid: false, error: 'Invalid expiry date' };
  }

  if (!/^\d{3,4}$/.test(cvc)) {
    return { valid: false, error: 'Invalid CVC' };
  }

  return { valid: true };
};

export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  }
  return value;
};

export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  
  if (v.length >= 2) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  }
  
  return v;
};