const footerLinks = {
  Menu: [
    { name: 'Manifesto', href: '#' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Docs', href: '#' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ],
  Social: [
    { name: 'Discord', href: '#' },
    { name: 'X / Twitter', href: '#' },
    { name: 'YouTube', href: '#' },
  ],
  Resources: [
    { name: 'Affiliate Program', href: '#' },
    { name: 'Launch Announcement', href: '#' },
    { name: 'Introducing Spotlight', href: '#' },
    { name: 'Brand Kit', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-16">
              <span className="text-7xl font-bold">Mocha</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-6 text-gray-400">{category}</h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white hover:text-gray-300 transition-colors text-lg"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © Copyright Axilla, Inc. 2025
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Top ▲</a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Platform Rules</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
