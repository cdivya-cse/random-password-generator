import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & description */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Secure<span className="text-indigo-400">Pass</span>
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 max-w-md">
              First-Year Engineering Mini-Project: Random Password Checker and Generator using Java Object-Oriented Programming (OOP) and SecureRandom CSPRNG.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <button
              onClick={() => onNavigate('checker')}
              className="hover:text-white transition-colors"
            >
              Password Checker
            </button>
            <button
              onClick={() => onNavigate('generator')}
              className="hover:text-white transition-colors"
            >
              Password Generator
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigate('tips')}
              className="hover:text-white transition-colors"
            >
              Security Tips
            </button>
            <button
              onClick={() => onNavigate('oop-docs')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Java OOP Docs
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span>Built with security and privacy in mind. Zero logging &amp; client-side privacy.</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} SecurePass &middot; Academic Demonstration Edition
          </div>
        </div>
      </div>
    </footer>
  );
};
