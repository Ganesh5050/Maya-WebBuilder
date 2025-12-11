import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              About Mocha
            </h1>
            <p className="text-xl text-gray-600">
              Building the future of app development
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                At Mocha, we believe that everyone should be able to bring their ideas to life, 
                regardless of their technical background. We're building an AI-powered platform 
                that makes app development accessible to everyone—from entrepreneurs to small 
                business owners to creative professionals.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Mocha was founded with a simple goal: democratize software development. 
                We saw that while there were many tools for building apps, most still required 
                significant technical knowledge or produced cookie-cutter results.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                We set out to create something different—an AI assistant that could understand 
                your vision and build exactly what you need, with the flexibility of custom code 
                but the simplicity of natural conversation.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Us</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                We're always looking for talented people to join our mission. If you're passionate 
                about democratizing technology and building the future of software development, 
                we'd love to hear from you.
              </p>
              <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                View Open Positions
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
