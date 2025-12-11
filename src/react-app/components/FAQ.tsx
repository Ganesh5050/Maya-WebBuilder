import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is Mocha?',
    answer: 'Mocha is an AI-powered no-code app builder that allows you to build custom software and native AI apps without writing any code. You can describe what you want with words in a builder\'s chat, and we go back-and-forth with you to turn your ideas into a working application, hosting, database, AI logic, and everything.',
  },
  {
    question: 'Do I need coding experience to use Mocha?',
    answer: 'No coding experience is required. Mocha is designed to be accessible to everyone, regardless of technical background.',
  },
  {
    question: 'What types of applications can I build using Mocha?',
    answer: 'You can build a wide variety of applications including websites, web apps, SaaS products, internal tools, and more.',
  },
  {
    question: 'Can I write backend with Mocha?',
    answer: 'Yes, Mocha can generate full-stack applications including backend logic, databases, and APIs.',
  },
  {
    question: 'Can I deploy my Mocha app?',
    answer: 'Yes, you can deploy your app with one click to a custom domain or Mocha subdomain.',
  },
  {
    question: 'Do I own the application?',
    answer: 'Yes, you own all the code and data for applications you build with Mocha.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-600">
            If you have more questions, check our docs or join our Discord
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-[20px] overflow-hidden transition-all duration-300"
              style={{
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.80656px 1.80656px -1.33333px, rgba(0, 0, 0, 0.07) 0px 3.62176px 3.62176px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.66667px, rgba(0, 0, 0, 0.05) 0px 13.6468px 13.6468px -3.33333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-200/50 transition-colors rounded-[20px]"
                style={{
                  boxShadow: 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset'
                }}>
                <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
