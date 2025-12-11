const projects = [
  {
    title: 'Personalized portfolio website',
    image: 'https://mocha-cdn.com/019a59c1-b2f5-7d7f-8b84-f5cbd07c312c/Screenshot-2025-11-06-205905.png',
  },
  {
    title: 'High conversion lead landing page',
    image: 'https://mocha-cdn.com/019a59c1-b2f5-7d7f-8b84-f5cbd07c312c/Screenshot-2025-11-06-205921.png',
  },
  {
    title: 'Personal link tree',
    image: 'https://mocha-cdn.com/019a59c1-b2f5-7d7f-8b84-f5cbd07c312c/Screenshot-2025-11-06-205927.png',
  },
  {
    title: 'Minimalist journaling app',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
  },
  {
    title: 'Personal finance tracker',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
  },
  {
    title: 'Beautiful waitlist page',
    image: 'https://mocha-cdn.com/019a59c1-b2f5-7d7f-8b84-f5cbd07c312c/Screenshot-2025-11-06-205939.png',
  },
];

export default function BuiltWithMocha() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Built with Mocha.
          </h2>
          <p className="text-xl text-gray-600">Real projects, real people.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-gray-100 rounded-[20px] overflow-hidden transition-all duration-300"
              style={{
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
              }}
            >
              <div className="aspect-video bg-gray-50 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
