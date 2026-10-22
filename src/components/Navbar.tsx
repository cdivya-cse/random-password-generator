import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [javaHealthy, setJavaHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setJavaHealthy(data.status === 'UP');
      } else {
        setJavaHealthy(false);
      }
    } catch {
      setJavaHealthy(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark */}
        <a 
          href="#home"
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          className="flex items-center gap-2.5 text-slate-100 transition-opacity hover:opacity-90 shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Secure<span className="text-indigo-400">Pass</span>
          </span>
        </a>

        {/* Zone 2: 4-5 single-line clean text nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <a
            href="#checker"
            onClick={(e) => { e.preventDefault(); onNavigate('checker'); }}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            Password Checker
          </a>
          <a
            href="#generator"
            onClick={(e) => { e.preventDefault(); onNavigate('generator'); }}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            Password Generator
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => { e.preventDefault(); onNavigate('how-it-works'); }}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#tips"
            onClick={(e) => { e.preventDefault(); onNavigate('tips'); }}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            Security Tips
          </a>
          <a
            href="#oop-docs"
            onClick={(e) => { e.preventDefault(); onNavigate('oop-docs'); }}
            className="whitespace-nowrap text-indigo-300 transition-colors hover:text-indigo-200"
          >
            Java OOP Hub
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={checkHealth}
            title="Check Java Backend Status"
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white whitespace-nowrap"
          >
            {checking ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />
            ) : javaHealthy ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span>Java 17 OOP Core</span>
          </button>
        </div>
      </div>
    </header>
  );
};
