import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
  return (
    <footer className="w-full relative bg-brand-dark mt-auto pt-24 pb-8 z-10">
      {/* Melting Wave Divider - Top of Footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 -translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[80px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,158.51,122.5,224.89,105.5Z" fill="#F9FAFB"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-black tracking-tight text-white group-hover:text-brand-yellow transition-colors">
              Thoughts
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-5 flex-wrap justify-center">
            <Link to="/"           className="text-sm font-bold text-gray-400 hover:text-brand-yellow transition-colors">Home</Link>
            <Link to="/all-posts"  className="text-sm font-bold text-gray-400 hover:text-brand-yellow transition-colors">Explore</Link>
            <Link to="/add-post"   className="text-sm font-bold text-gray-400 hover:text-brand-yellow transition-colors">Write</Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-gray-400 hover:text-brand-purple transition-colors"
            >
              GitHub
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-xs font-bold text-gray-300">
            © {new Date().getFullYear()} Thoughts
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
