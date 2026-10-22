import React from 'react';
import { Edit3, Cpu, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter Your Password',
      description: 'Type or paste your candidate password. The frontend sends a clean JSON payload to the Java backend via HTTP POST.',
      icon: Edit3,
    },
    {
      step: '02',
      title: 'Analyze Strength',
      description: 'Java PasswordChecker executes polymorphic rules, computes Shannon information entropy, and penalizes repetitive dictionary patterns.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Improve Security',
      description: 'Review granular checklist items and actionable suggestions, or generate high-entropy credentials backed by SecureRandom CSPRNG.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Workflow</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-1.5">
            How It Works
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            A seamless bridge between modern web frontend and robust Java Object-Oriented backend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-md transition-all hover:border-slate-700/80 hover:bg-slate-900/60"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-700">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
