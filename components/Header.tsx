import React from 'react';
import { MailIcon } from './icons';

// Navbar component is defined here to avoid creating a new file.
const Navbar: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
  const navItems = ['Home', 'About', 'Privacy Policy', 'Contact'];
  return (
    <nav className="bg-slate-800/60 border border-slate-700 rounded-full p-2 backdrop-blur-sm">
      <ul className="flex items-center justify-center gap-2 sm:gap-4">
        {navItems.map((item) => (
          <li key={item}>
            <button
              onClick={() => setCurrentPage(item.toLowerCase().replace(' ', '-'))}
              className="px-4 py-2 text-sm sm:text-base text-slate-300 hover:bg-slate-700 hover:text-white rounded-full transition-colors duration-200"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};


const Header: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
  return (
    <header className="text-center mb-8 sm:mb-12 space-y-8">
      <div className="flex items-center justify-center gap-4">
        <MailIcon className="w-12 h-12 text-sky-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 cursor-pointer" onClick={() => setCurrentPage('home')}>
          AI Email Finder Pro
        </h1>
      </div>
      <Navbar setCurrentPage={setCurrentPage} />
    </header>
  );
};

export default Header;