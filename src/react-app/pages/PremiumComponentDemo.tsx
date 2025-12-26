import { useState } from 'react';
import { SpotlightHero } from '../../components/aceternity/SpotlightHero';
import { TechBentoGrid, EcommerceBentoGrid } from '../../components/aceternity/BentoGrid';
import { TestimonialMarquee } from '../../components/magic-ui/Marquee';
import { TechBorderBeamButton, EcommerceBorderBeamButton, LuxuryBorderBeamButton } from '../../components/magic-ui/BorderBeam';
import { ProductCard3D } from '../../components/aceternity/ThreeDCard';

export function PremiumComponentDemo() {
  const [selectedIndustry, setSelectedIndustry] = useState<'tech' | 'ecommerce' | 'luxury'>('tech');

  const industries = {
    tech: {
      name: 'Tech SaaS',
      colors: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' },
      features: [
        { title: 'Cloud Architecture', description: 'Scalable infrastructure that grows with you', icon: '☁️' },
        { title: 'Advanced Analytics', description: 'Real-time insights and reporting', icon: '📊' },
        { title: 'Enterprise Security', description: 'Bank-level encryption and compliance', icon: '🔒' },
        { title: 'API Integration', description: 'Seamless connectivity with existing tools', icon: '🔗' },
        { title: '24/7 Support', description: 'Round-the-clock expert assistance', icon: '🛠️' },
        { title: 'Auto-Scaling', description: 'Intelligent scaling based on usage', icon: '⚡' }
      ],
      testimonials: [
        { name: 'David Kim', role: 'CTO', company: 'TechStart Inc', content: 'This platform revolutionized our workflow. Incredible performance!', rating: 5 },
        { name: 'Lisa Thompson', role: 'Product Manager', company: 'InnovateCorp', content: 'The analytics features are game-changing. Better decisions faster.', rating: 5 },
        { name: 'Alex Rodriguez', role: 'DevOps Lead', company: 'ScaleUp Solutions', content: 'Best SaaS platform we\'ve used. Seamless API integration.', rating: 5 }
      ]
    },
    ecommerce: {
      name: 'Athletic Footwear',
      colors: { primary: '#ea580c', secondary: '#dc2626', accent: '#ffffff' },
      features: [
        { title: 'Performance Tech', description: 'Advanced cushioning for peak performance', icon: '⚡' },
        { title: 'Durable Build', description: 'Built to withstand intense training', icon: '🛡️' },
        { title: 'Breathable Design', description: 'Moisture-wicking materials', icon: '💨' },
        { title: 'Perfect Fit', description: 'Precision sizing for comfort', icon: '📏' },
        { title: 'Style Variety', description: 'From training to lifestyle', icon: '✨' },
        { title: 'Sustainable', description: 'Eco-friendly construction', icon: '🌱' }
      ],
      testimonials: [
        { name: 'Marcus Johnson', role: 'Pro Runner', company: 'Elite Athletics', content: 'These shoes transformed my training. Unmatched comfort and performance.', rating: 5 },
        { name: 'Sarah Chen', role: 'Fitness Coach', company: 'Peak Performance', content: 'I recommend these to all clients. Exceptional quality.', rating: 5 },
        { name: 'Mike Rodriguez', role: 'Marathoner', company: 'City Running', content: 'Perfect for long distances. Feet feel great after 26 miles.', rating: 5 }
      ],
      products: [
        { name: 'Elite Runner Pro', price: '$149.99', image: '/api/placeholder/400/300', description: 'Professional running shoe with advanced cushioning' },
        { name: 'Training Max', price: '$129.99', image: '/api/placeholder/400/300', description: 'Versatile training shoe for all workouts' }
      ]
    } as const,
    luxury: {
      name: 'Luxury Footwear',
      colors: { primary: '#1b4332', secondary: '#d4af37', accent: '#ffffff' },
      features: [
        { title: 'Handcrafted', description: 'Meticulously crafted by master artisans', icon: '👨‍🎨' },
        { title: 'Premium Materials', description: 'Finest Italian leather and exotic materials', icon: '💎' },
        { title: 'Bespoke Service', description: 'Custom fitting and personalization', icon: '📐' },
        { title: 'Timeless Design', description: 'Classic styles that never age', icon: '⏰' },
        { title: 'Heritage Quality', description: 'Generations of craftsmanship', icon: '🏛️' },
        { title: 'Lifetime Care', description: 'Complimentary maintenance', icon: '🔧' }
      ],
      testimonials: [
        { name: 'James Wellington', role: 'CEO', company: 'Wellington & Associates', content: 'Exquisite craftsmanship. These shoes are works of art.', rating: 5 },
        { name: 'Isabella Rossi', role: 'Fashion Director', company: 'Vogue Italia', content: 'Extraordinary attention to detail. Pure luxury.', rating: 5 },
        { name: 'Charles Pemberton', role: 'Collector', company: 'Private', content: 'I own 200+ luxury shoes. These are the finest.', rating: 5 }
      ],
      products: [
        { name: 'Oxford Masterpiece', price: '$899.99', image: '/api/placeholder/400/300', description: 'Hand-stitched Oxford in premium Italian leather' },
        { name: 'Derby Elegance', price: '$799.99', image: '/api/placeholder/400/300', description: 'Classic Derby with modern comfort' }
      ]
    } as const
  };

  const currentIndustry = industries[selectedIndustry];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            🎬 Premium Component Showcase
          </h1>
          <p className="text-xl mb-8">
            See how premium animated components transform your websites from basic to STUNNING
          </p>
          
          {/* Industry Selector */}
          <div className="flex justify-center gap-4 mb-8">
            {Object.entries(industries).map(([key, industry]) => (
              <button
                key={key}
                onClick={() => setSelectedIndustry(key as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedIndustry === key
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>
          
          <div className="bg-white/10 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">🎯 The Transformation</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-red-500/20 p-4 rounded-lg">
                <h4 className="font-bold text-red-200 mb-2">❌ BEFORE (Basic Components)</h4>
                <ul className="text-red-100 text-sm space-y-1">
                  <li>• Static pink buttons</li>
                  <li>• Plain card layouts</li>
                  <li>• No animations</li>
                  <li>• Generic appearance</li>
                  <li>• Same for all industries</li>
                </ul>
              </div>
              <div className="bg-green-500/20 p-4 rounded-lg">
                <h4 className="font-bold text-green-200 mb-2">✅ AFTER (Premium Components)</h4>
                <ul className="text-green-100 text-sm space-y-1">
                  <li>• Animated spotlight heroes</li>
                  <li>• 3D hover effects</li>
                  <li>• Border beam animations</li>
                  <li>• Infinite scrolling testimonials</li>
                  <li>• Industry-specific designs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Spotlight Hero */}
      <SpotlightHero
        title={`Experience ${currentIndustry.name} Excellence`}
        subtitle="Premium Components"
        description={`Discover how premium animated components transform ${currentIndustry.name.toLowerCase()} websites into stunning, professional experiences that captivate users and drive conversions.`}
        primaryCTA="See Components"
        secondaryCTA="Learn More"
        colors={currentIndustry.colors}
      />

      {/* Animated Bento Grid */}
      <div className="py-20">
        {selectedIndustry === 'tech' && <TechBentoGrid features={[...currentIndustry.features]} />}
        {selectedIndustry === 'ecommerce' && <EcommerceBentoGrid features={[...currentIndustry.features]} />}
        {selectedIndustry === 'luxury' && (
          <div className="py-20 bg-gradient-to-br from-slate-900 to-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Luxury Features</h2>
                <p className="text-xl text-gray-300">Uncompromising quality and craftsmanship</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {currentIndustry.features.map((feature, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3D Product Cards (for ecommerce/luxury) */}
      {'products' in currentIndustry && currentIndustry.products && (
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">3D Product Showcase</h2>
              <p className="text-xl text-gray-600">Hover to see the 3D effect in action</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 justify-items-center">
              {'products' in currentIndustry && currentIndustry.products?.map((product: any, i: number) => (
                <ProductCard3D
                  key={i}
                  product={product}
                  colors={currentIndustry.colors}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Infinite Scrolling Testimonials */}
      <TestimonialMarquee
        testimonials={[...currentIndustry.testimonials]}
        colors={currentIndustry.colors}
      />

      {/* Animated CTA Buttons */}
      <div className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Premium Animated Buttons</h2>
          <p className="text-xl text-gray-300 mb-12">
            Each industry gets unique button animations and colors
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">Tech SaaS Style</p>
              <TechBorderBeamButton>
                Start Free Trial
              </TechBorderBeamButton>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">E-commerce Style</p>
              <EcommerceBorderBeamButton>
                Shop Now
              </EcommerceBorderBeamButton>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">Luxury Style</p>
              <LuxuryBorderBeamButton>
                Explore Collection
              </LuxuryBorderBeamButton>
            </div>
          </div>
          
          <div className="mt-16 bg-green-500/10 border border-green-500/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              🎉 The Result: STUNNING Websites!
            </h3>
            <p className="text-green-300 text-lg">
              Your AI builder now generates websites that look like they cost $10,000+ to build!
            </p>
            <ul className="text-green-200 mt-4 space-y-2">
              <li>✅ Premium animations (Aceternity-style)</li>
              <li>✅ Industry-specific components</li>
              <li>✅ 3D hover effects</li>
              <li>✅ Infinite scrolling testimonials</li>
              <li>✅ Animated border beams</li>
              <li>✅ Professional spotlight heroes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}