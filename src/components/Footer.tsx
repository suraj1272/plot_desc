import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg">
                <span className="text-gray-900 font-black text-sm">SM</span>
              </div>
              <div>
                <div className="text-white font-black">Shree Mata Developers</div>
                <div className="text-amber-400/70 text-xs">Building Trust. Creating Futures.</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium plotted developments with DTCP approval, clear titles, and modern infrastructure.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { href: '#hero', label: 'Home' },
                { href: '#about', label: 'About Us' },
                { href: '#layout', label: 'Master Plan' },
                { href: '#contact', label: 'Contact' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-gray-500 hover:text-amber-400 text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p>📍 Nalatavad, Survey No. 98 & 101</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ info@shreematadevelopers.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Shree Mata Developers. All rights reserved.</p>
          <div className="flex gap-4">
            <span>DTCP Approved</span>
            <span>·</span>
            <span>RERA Registered</span>
            <span>·</span>
            <span>Royal Enclave, Nalatavad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
