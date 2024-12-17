import React from 'react';
import { Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Essential health tracking features',
      features: [
        'Basic health metrics tracking',
        'Daily activity monitoring',
        'Basic AI insights',
        'Local data storage',
        'Standard support'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      description: 'Advanced features for health enthusiasts',
      popular: true,
      features: [
        'All Basic features',
        'Advanced health analytics',
        'Personalized AI recommendations',
        'Wearable device integration',
        'Priority support',
        'Cloud backup',
        'Export health data'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Custom solutions for organizations',
      features: [
        'All Pro features',
        'Custom integration options',
        'Dedicated support team',
        'Advanced security features',
        'Custom analytics',
        'API access',
        'Team management'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-600/20 to-purple-600/20 border-2 border-blue-500/20'
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg">/month</span>}
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};