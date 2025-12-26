import { useState, useEffect } from 'react';
import Header from '@/react-app/components/Header';
import Hero from '@/react-app/components/Hero';
import TemplateShowcase from '@/react-app/components/TemplateShowcase';
import BuiltWithMocha from '@/react-app/components/BuiltWithMocha';
import ParallaxCardStack from '@/react-app/components/ParallaxCardStack';
import IntegratedSolution from '@/react-app/components/IntegratedSolution';
import Testimonials from '@/react-app/components/Testimonials';
import FAQ from '@/react-app/components/FAQ';
import Footer from '@/react-app/components/Footer';
import { IndustryDemo } from '@/react-app/components/IndustryDemo';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Hero />
        <IndustryDemo />
        <TemplateShowcase />
        <BuiltWithMocha />
        <ParallaxCardStack />
        <IntegratedSolution />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
