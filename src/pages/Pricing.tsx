import React from 'react';
import { Navbar } from '../components/shared/Navbar';
import { Check, Star, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing: React.FC = () => {
  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You will continue to have access to your plan features until the end of your billing period.'
    },
    {
      question: 'Is my health data secure?',
      answer: 'Absolutely. We use end-to-end encryption and store your data locally on your device. Your privacy and security are our top priorities.'
    },
    {
      question: 'Can I switch between plans?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you are not satisfied, contact our support team.'
    }
  ];

  // ... rest of the component remains the same
};