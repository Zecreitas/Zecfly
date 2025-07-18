import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-muted shadow-soft mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Zecfly Logo" className="h-7 w-7 rounded-xl" />
          <span className="font-display text-lg font-bold text-primary">Zecfly</span>
        </div>
        <div className="flex gap-4 text-sm text-dark/70">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/flights" className="hover:text-primary transition-colors">Voos</Link>
          <Link to="/hotels" className="hover:text-primary transition-colors">Hotéis</Link>
          <Link to="/auth" className="hover:text-primary transition-colors">Login</Link>
        </div>
        <div className="text-xs text-dark/50">© {new Date().getFullYear()} Zecfly. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}
