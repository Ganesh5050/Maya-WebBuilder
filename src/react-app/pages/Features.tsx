import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import { Code, Database, Lock, Zap, Globe, Palette } from 'lucide-react';

const features = [
  {
    icon: Code,
    title: 'AI-Powered Development',
    description: 'Build full-stack applications with natural language. No coding required.',
  },
  {
    icon: Database,
    title: 'Built-in Database',
    description: 'Integrated SQLite database with automatic schema management.',
  },
  {
    icon: Lock,
    title: 'Authentication Ready',
    description: 'User authentication and authorization built right in.',
  },
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Deploy to production with a single click. Updates go live instantly.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Host on your own domain or use a free Mocha subdomain.',
  },
  {
    icon: Palette,
    title: 'Beautiful Design',
    description: 'Every app is uniquely designed to match your vision.',
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Everything you need to build
            </h1>
            <p className="text-xl text-gray-600">
              Powerful features that make app building effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
