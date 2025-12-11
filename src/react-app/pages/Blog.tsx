import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';

const posts = [
  {
    title: 'Introducing Mocha: AI-Powered App Building',
    excerpt: 'Today we are excited to announce Mocha, a revolutionary way to build applications using AI.',
    date: 'November 1, 2024',
    author: 'Mocha Team',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop',
  },
  {
    title: 'How to Build Your First App in 5 Minutes',
    excerpt: 'A step-by-step guide to creating your first application with Mocha.',
    date: 'October 28, 2024',
    author: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  },
  {
    title: 'The Future of No-Code Development',
    excerpt: 'Exploring how AI is transforming the way we build software.',
    date: 'October 25, 2024',
    author: 'Alex Johnson',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600">
              News, tips, and insights from the Mocha team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.title}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
