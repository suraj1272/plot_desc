import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#layout', label: 'Master Plan' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-md border-b border-white/10 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all">
            <span className="text-gray-900 font-black text-xs tracking-tight">SM</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-black text-sm leading-none">Shree Mata</div>
            <div className="text-amber-400 text-[10px] font-medium tracking-widest uppercase">Developers</div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+911234567890"
            className="ml-4 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg shadow-amber-500/25"
          >
            📞 Call Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/98 backdrop-blur-md border-b border-white/10 px-6 py-4 space-y-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 hover:text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+911234567890"
            className="block mt-3 bg-amber-500 text-gray-900 font-bold px-4 py-3 rounded-lg text-sm text-center"
          >
            📞 Call Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
