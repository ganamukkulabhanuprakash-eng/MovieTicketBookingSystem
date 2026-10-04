import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clapperboard, Search, Menu, X, User } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    // `relative` here gives the absolute mobile panel a correct stacking ancestor
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-canvas/80 border-b border-border relative">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity shrink-0"
          onClick={closeMobileMenu}
        >
          <Clapperboard className="w-7 h-7" aria-hidden="true" />
          <span className="text-xl font-bold tracking-wide text-text-primary">CineVault</span>
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5 ${
                isActive(link.path)
                  ? 'text-primary border-b-2 border-primary pb-0'
                  : 'text-text-secondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ── Desktop Right Actions ── */}
        <div className="hidden md:flex items-center gap-3">
          <button
            aria-label="Search"
            className="text-text-secondary hover:text-primary transition-colors p-2 rounded-full
                       hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>
          <Link to="/login">
            <Button className="flex items-center gap-2">
              <User className="w-4 h-4" aria-hidden="true" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* ── Mobile Menu Toggle ── */}
        <button
          className="md:hidden flex items-center justify-center p-2 text-text-secondary
                     hover:text-text-primary hover:bg-surface-elevated rounded-md
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Mobile Navigation Panel ── */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden absolute top-full left-0 w-full z-40
                     bg-surface border-b border-border shadow-xl
                     py-4 px-4 flex flex-col gap-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={closeMobileMenu}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center gap-3 pt-4 mt-2 border-t border-border">
            <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg
                               bg-surface-elevated text-text-primary hover:bg-border hover:text-text-primary
                               text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Search className="w-4 h-4" aria-hidden="true" />
              Search
            </button>
            <Link to="/login" className="flex-1" onClick={closeMobileMenu}>
              <Button fullWidth>Sign In</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
