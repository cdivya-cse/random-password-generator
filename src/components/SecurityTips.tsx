import React from 'react';
import { ShieldAlert, RefreshCw, KeyRound, Lock, Info } from 'lucide-react';

export const SecurityTips: React.FC = () => {
  const tips = [
    {
      title: 'Length Trumps Complexity',
      description: 'An 18-character passphrase formed of random words or characters is exponentially harder for brute-force clusters to crack than an 8-character string with complex symbols.',
      icon: Lock,
    },
    {
      title: 'Never Reuse Passwords',
      description: 'Reusing a single strong password across accounts exposes you to credential stuffing attacks whenever any single service experiences a database breach.',
      icon: RefreshCw,
    },
    {
      title: 'Avoid Personal Details',
      description: 'Never include birth dates, family names, pet names, or easily discoverable biographical facts that attackers can harvest from OSINT or social profiles.',
      icon: ShieldAlert,
    },
    {
      title: 'Adopt a Password Manager',
      description: 'Utilize an audited, end-to-end encrypted password manager (like Bitwarden or 1Password) so you only need to remember one strong master passkey.',
      icon: KeyRound,
    },
  ];

  return (
    <section id="tips" className="pt-16 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Cyber Hygiene</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-1.5">
            Password Security Tips
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Industry-standard best practices to protect your identity and digital credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md transition-all hover:border-slate-700/80 hover:bg-slate-900/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{tip.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tip.description}</p>
              </div>
            );
          })}
        </div>

        {/* About This Tool Card */}
        <div className="mt-12 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">About SecurePass Analysis Heuristics</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                SecurePass evaluates password resilience locally through algorithmic heuristics, Shannon information entropy formulas, and pattern penalization running inside our Java OOP backend. 
                Passwords evaluated or generated here are <strong className="text-slate-300">never stored in a database, never written to log files, and never transmitted to external third-party services</strong>. 
                Please note that strength scoring is a mathematical heuristic estimation and should be paired with Multi-Factor Authentication (MFA) for comprehensive account defense.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
