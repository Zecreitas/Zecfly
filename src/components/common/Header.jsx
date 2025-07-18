import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Voos', path: '/flights' },
  { name: 'Hotéis', path: '/hotels' },
  { name: 'Login', path: '/auth' },
];

export default function Header() {
  const location = useLocation();
  return (
    <header className="bg-surface shadow-soft sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Zecfly Logo" className="h-8 w-8 rounded-xl shadow-md" />
          <span className="font-display text-xl font-bold text-primary tracking-tight">Zecfly</span>
        </Link>
        <nav className="flex gap-2 sm:gap-6">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative px-3 py-2 rounded-xl font-medium transition-colors duration-200
                ${location.pathname === link.path ? 'text-primary bg-muted' : 'text-dark hover:text-primary hover:bg-muted/70'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
