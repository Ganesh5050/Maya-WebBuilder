const testimonials = [
  {
    name: 'Jordan',
    handle: '@jordansingh',
    text: 'I used Mocha to prototype a full stack app in minutes! I like to preach that coding shouldn\'t be a barrier to innovation or making money and Mocha perfectly exemplifies this. Highly recommend to anyone looking to quickly ship projects with no code.',
  },
  {
    name: 'Omar Yousry',
    handle: '@omarkhatib_',
    text: 'Mocha has been very helpful in making my ideas a reality without having to think about implementation details. Sometimes it also gives me inspiration on new things I can build. Mocha is like having a technical friend who\'s always willing to help.',
  },
  {
    name: 'Brad Silva',
    handle: '@BradSilva_',
    text: 'Blew me away! Mocha isn\'t just a "builder"—it\'s like a technical co-founder in your pocket. Creating everything from a marketing site to a fully-functional app with a database is so simple—and honestly addictive. It asks thoughtful questions as you work, and delivers exactly what I was imagining. I can finally build products fast without being a software engineer. This is the future of what\'s possible.',
  },
  {
    name: 'David Shrair',
    handle: '@dshrair',
    text: 'Mocha came alive for me shortly after I started with a B2B SaaS idea for my business area. It really impressed me by taking my complex requirements and delivering a functioning example quickly with minimal back and forth. And it\'s gotten better with every update released. I look forward to learning more about it in the coming weeks and building more using it!',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Testimonials
          </h2>
          <p className="text-xl text-gray-600">What are users saying?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-[20px] p-8 transition-all duration-300"
              style={{
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.handle}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
