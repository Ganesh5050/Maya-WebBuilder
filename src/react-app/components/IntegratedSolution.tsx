const features = [
  {
    title: 'Build with words, not code.',
    description: 'Describe what you want in plain English. Mocha\'s AI agent turns your ideas into working apps—no technical knowledge required.',
  },
  {
    title: 'Describe what you need.',
    description: 'Just tell Mocha what you want and it builds it for you. Watch as pages, databases, auth, email, storage. All built in. Unlike other AI app-builders, Mocha gives you everything you need.',
  },
  {
    title: 'Perfect it in real time',
    description: 'Watch your idea come to life instantly. Mocha refines your app with every prompt—then polish with one click.',
  },
  {
    title: 'Everything included. Zero setup.',
    description: 'Database, auth, email, storage. All built in. Unlike other AI app-builders, Mocha gives you everything you need.',
  },
  {
    title: 'Launch and grow',
    description: 'When your idea is ready, launch it to the world in one click. Deploy to a subdomain or custom domain, all in one place.',
  },
  {
    title: 'Unique designs, no cookie-cutter templates',
    description: 'Every UI Mocha creates is one-of-a-kind—custom-built to match your vision, not pulled from a template library.',
  },
];

export default function IntegratedSolution() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            A fully integrated solution
          </h2>
          <p className="text-xl text-gray-600">Mocha's all-in-one platform</p>
        </div>

        {/* Feature Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <div key={index} className="space-y-6">
              {/* Placeholder for feature image/illustration */}
              <div className="aspect-video bg-gray-100 rounded-[20px] p-12 flex items-center justify-center transition-all duration-300"
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                }}>
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">{'0' + (index + 1)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {'0' + (index + 1)} {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
