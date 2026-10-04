import React from 'react';
import { Film, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-12 py-8 md:py-12 text-text-muted">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90">
            <Film className="w-6 h-6" />
            <span className="text-lg font-bold tracking-wide text-text-primary">CineVault</span>
          </Link>
          <p className="text-sm">
            Your premier destination for booking movie tickets online. Experience the magic of cinema with ease.
          </p>
        </div>
        
        <div>
          <h3 className="text-text-primary font-semibold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-text-primary font-semibold mb-4">Legal</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-text-primary font-semibold mb-4">Connect</h3>
          <div className="flex items-center gap-4">
            <a href="mailto:support@cinevault.com" className="hover:text-primary transition-colors p-2 rounded-full bg-surface-elevated">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors p-2 rounded-full bg-surface-elevated">
              <Film className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border text-center text-sm">
        <p>&copy; {new Date().getFullYear()} CineVault. All rights reserved.</p>
      </div>
    </footer>
  );
}
