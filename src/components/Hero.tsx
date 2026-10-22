import React from 'react';
import { Shield, Sparkles, Key, Lock, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onGenerateClick: () => void;
  onCheckerClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGenerateClick, onCheckerClick }) => {
  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[480px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-indigo-300 uppercase mb-6">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span>PASSWORD SECURITY TOOL</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Your Password.{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                Your Security.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              Test your password strength and generate powerful passwords in seconds.
              Engineered with Object-Oriented Java, cryptographic SecureRandom, and real-time entropy scoring.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onGenerateClick}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-[0.98]"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Secure Password
              </button>

              <button
                onClick={onCheckerClick}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 active:scale-[0.98]"
              >
                <Lock className="mr-2 h-4 w-4 text-slate-400" />
                Check Password Strength
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero Logging &amp; Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Java SecureRandom CSPRNG</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Pure Java OOP Heuristic Engine</span>
              </div>
            </div>
          </div>

          {/* Right Column: Decorative Cybersecurity Graphic / Visual Security Meter */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Cryptographic Vault</div>
                    <div className="text-[11px] text-slate-500">Live Strength Simulation</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  98/100
                </span>
              </div>

              {/* Sample Simulated Key */}
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Simulated Passkey</div>
                  <div className="mt-1 font-mono text-sm font-semibold tracking-wider text-cyan-300 break-all">
                    K9#mQ2$vP8!wZ4*t
                  </div>
                </div>

                {/* Animated progress meter */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
                    <span>Brute Force Resistance</span>
                    <span className="text-cyan-400">Very Strong</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-cyan-400 transition-all duration-1000" />
                  </div>
                </div>

                {/* Mini Metric Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-2.5">
                    <div className="text-[11px] text-slate-500">Shannon Entropy</div>
                    <div className="mt-0.5 font-mono text-xs font-semibold text-slate-200">92.4 bits</div>
                  </div>
                  <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-2.5">
                    <div className="text-[11px] text-slate-500">Est. Crack Time</div>
                    <div className="mt-0.5 font-mono text-xs font-semibold text-emerald-400">Millions of years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
