import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PasswordCheckerCard } from './components/PasswordCheckerCard';
import { PasswordGeneratorCard } from './components/PasswordGeneratorCard';
import { HowItWorks } from './components/HowItWorks';
import { SecurityTips } from './components/SecurityTips';
import { OopArchitectureHub } from './components/OopArchitectureHub';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedPasswordForChecker, setSelectedPasswordForChecker] = useState<string>('');

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendToChecker = (password: string) => {
    setSelectedPasswordForChecker(password);
    const checkerEl = document.getElementById('checker');
    if (checkerEl) {
      checkerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onGenerateClick={() => handleNavigate('generator')}
          onCheckerClick={() => handleNavigate('checker')}
        />

        {/* Primary Interactive Cards: Checker and Generator */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Left: Password Checker Card */}
              <PasswordCheckerCard
                externalPassword={selectedPasswordForChecker}
                onClearExternalPassword={() => setSelectedPasswordForChecker('')}
              />

              {/* Right: Password Generator Card */}
              <PasswordGeneratorCard
                onSendToChecker={handleSendToChecker}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Password Security Tips Section */}
        <SecurityTips />

        {/* Java OOP Architecture & College Viva Documentation Hub */}
        <OopArchitectureHub />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
