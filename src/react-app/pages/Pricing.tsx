import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out Mocha',
    features: [
      '3 active projects',
      'Basic AI assistance',
      'Community support',
      'Deploy to Mocha subdomain',
    ],
  },
  {
    name: 'Pro',
    price: '$20',
    description: 'For serious builders',
    features: [
      'Unlimited projects',
      'Advanced AI assistance',
      'Priority support',
      'Custom domain deployment',
      'Private projects',
      'Collaboration features',
      'Advanced analytics',
    ],
    popular: true,
  },
  {
    name: 'Team',
    price: '$50',
    description: 'For teams building together',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared workspace',
      'Team analytics',
      'Dedicated support',
      'SSO & advanced security',
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl p-8 border-2 ${
                  plan.popular
                    ? 'border-black shadow-2xl'
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-black mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-white text-black border-2 border-black hover:bg-gray-50'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
