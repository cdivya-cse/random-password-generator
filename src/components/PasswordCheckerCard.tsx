import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, X, Check, AlertTriangle, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export interface PasswordResultData {
  score: number;
  strengthLevel: string;
  meetsLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  length: number;
  entropyBits: number;
  crackTimeDisplay: string;
  suggestions: string[];
  evaluatedTimestamp?: number;
}

interface PasswordCheckerCardProps {
  externalPassword?: string;
  onClearExternalPassword?: () => void;
}

export const PasswordCheckerCard: React.FC<PasswordCheckerCardProps> = ({
  externalPassword,
  onClearExternalPassword,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PasswordResultData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync when external password (e.g. generated from the generator card) arrives
  useEffect(() => {
    if (externalPassword) {
      setPassword(externalPassword);
      analyzePassword(externalPassword);
      onClearExternalPassword?.();
    }
  }, [externalPassword]);

  const analyzePassword = async (pwdToAnalyze: string) => {
    if (!pwdToAnalyze.trim()) {
      setResult(null);
      setErrorMsg(null);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/check-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: pwdToAnalyze }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to reach Java backend`);
      }

      const data: PasswordResultData = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('[Checker Error]', err);
      setErrorMsg(err.message || 'Unable to communicate with Java PasswordChecker.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (!val) {
      setResult(null);
    }
  };

  const handleClear = () => {
    setPassword('');
    setResult(null);
    setErrorMsg(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      analyzePassword(password);
    }
  };

  // Helper for progress bar color & label badge
  const getStrengthAttributes = (level?: string) => {
    switch (level) {
      case 'Very Strong':
        return {
          barColor: 'bg-cyan-400',
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/30',
          bgGlow: 'from-cyan-500/10 to-indigo-500/10',
        };
      case 'Strong':
        return {
          barColor: 'bg-emerald-400',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          bgGlow: 'from-emerald-500/10 to-indigo-500/10',
        };
      case 'Medium':
        return {
          barColor: 'bg-amber-400',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          bgGlow: 'from-amber-500/10 to-indigo-500/10',
        };
      case 'Weak':
        return {
          barColor: 'bg-orange-500',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/30',
          bgGlow: 'from-orange-500/10 to-rose-500/10',
        };
      case 'Very Weak':
      default:
        return {
          barColor: 'bg-rose-500',
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/30',
          bgGlow: 'from-rose-500/10 to-slate-900',
        };
    }
  };

  const strengthAttr = getStrengthAttributes(result?.strengthLevel);

  return (
    <div id="checker" className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start gap-3.5 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Test Your Password</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzed via Java OOP rules engine, Shannon entropy, and dictionary checks.
            </p>
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Password Input
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type password to evaluate..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 pr-24 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            
            <div className="absolute right-2 flex items-center gap-1 text-slate-400">
              {password && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg p-1.5 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                  title="Clear password"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-lg p-1.5 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={!password || loading}
            onClick={() => analyzePassword(password)}
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing via Java...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Analyze Password
              </>
            )}
          </button>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dynamic Analysis Section */}
        {result && (
          <div className="mt-6 space-y-5 border-t border-slate-800/80 pt-6">
            {/* Strength Level & Score Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">Strength Assessment</span>
                  <div className={`text-lg font-bold ${strengthAttr.textColor}`}>
                    {result.strengthLevel}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">Score</span>
                  <div className="font-mono text-base font-bold text-slate-200">
                    <span className={strengthAttr.textColor}>{result.score}</span>
                    <span className="text-slate-500 text-xs"> / 100</span>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full ${strengthAttr.barColor} transition-all duration-500 ease-out`}
                  style={{ width: `${Math.max(5, result.score)}%` }}
                />
              </div>
            </div>

            {/* Cryptographic Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[11px] text-slate-500 uppercase tracking-wide">Information Entropy</span>
                <div className="mt-0.5 font-mono text-sm font-semibold text-slate-200">
                  {result.entropyBits.toFixed(1)} <span className="text-xs text-slate-500 font-sans">bits</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[11px] text-slate-500 uppercase tracking-wide">Est. Crack Time</span>
                <div className="mt-0.5 font-mono text-xs font-semibold text-slate-200 truncate" title={result.crackTimeDisplay}>
                  {result.crackTimeDisplay}
                </div>
              </div>
            </div>

            {/* Checklist of 5 Requirements */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Requirements Checklist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1. Length */}
                <div className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                  result.meetsLength ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-950/40 text-slate-500 border border-slate-800'
                }`}>
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    result.meetsLength ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'
                  }`}>
                    {result.meetsLength ? <Check className="h-3 w-3" /> : '•'}
                  </div>
                  <span>At least 8 characters ({result.length})</span>
                </div>

                {/* 2. Uppercase */}
                <div className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                  result.hasUppercase ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-950/40 text-slate-500 border border-slate-800'
                }`}>
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    result.hasUppercase ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'
                  }`}>
                    {result.hasUppercase ? <Check className="h-3 w-3" /> : '•'}
                  </div>
                  <span>Uppercase letter (A-Z)</span>
                </div>

                {/* 3. Lowercase */}
                <div className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                  result.hasLowercase ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-950/40 text-slate-500 border border-slate-800'
                }`}>
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    result.hasLowercase ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'
                  }`}>
                    {result.hasLowercase ? <Check className="h-3 w-3" /> : '•'}
                  </div>
                  <span>Lowercase letter (a-z)</span>
                </div>

                {/* 4. Numbers */}
                <div className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                  result.hasNumber ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-950/40 text-slate-500 border border-slate-800'
                }`}>
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    result.hasNumber ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'
                  }`}>
                    {result.hasNumber ? <Check className="h-3 w-3" /> : '•'}
                  </div>
                  <span>Numeric digit (0-9)</span>
                </div>

                {/* 5. Special */}
                <div className={`col-span-1 sm:col-span-2 flex items-center gap-2 rounded-lg p-2 transition-colors ${
                  result.hasSpecial ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-950/40 text-slate-500 border border-slate-800'
                }`}>
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    result.hasSpecial ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'
                  }`}>
                    {result.hasSpecial ? <Check className="h-3 w-3" /> : '•'}
                  </div>
                  <span>Special character (!@#$%^&*...)</span>
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Improvement Suggestions
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.suggestions.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empty State placeholder */}
        {!result && !loading && (
          <div className="mt-8 rounded-xl border border-dashed border-slate-800/80 p-6 text-center text-xs text-slate-500">
            <Sparkles className="mx-auto h-5 w-5 text-slate-600 mb-2" />
            Type any password or generate one above to trigger real-time Java analysis.
          </div>
        )}
      </div>
    </div>
  );
};
