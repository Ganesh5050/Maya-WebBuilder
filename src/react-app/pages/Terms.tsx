import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-12">Last updated: November 6, 2024</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Mocha, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to these Terms of Service, 
                please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Mocha grants you a personal, non-transferable, non-exclusive license to use the 
                service for your own personal or commercial purposes, subject to these Terms of Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You own all the code and content you create using Mocha. We do not claim any 
                ownership rights to your projects or data.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not use the service for any illegal purposes</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not abuse or exploit the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Limitations of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Mocha shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of 
                any material changes via email or through the service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms of Service, contact us at{' '}
                <a href="mailto:legal@getmocha.com" className="text-black font-medium hover:underline">
                  legal@getmocha.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
