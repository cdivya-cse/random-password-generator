import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Sliders, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { PasswordResultData } from './PasswordCheckerCard';

interface PasswordGeneratorCardProps {
  onSendToChecker?: (password: string) => void;
}

export const PasswordGeneratorCard: React.FC<PasswordGeneratorCardProps> = ({ onSendToChecker }) => {
  const [length, setLength] = useState<number>(16);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSpecial, setUseSpecial] = useState<boolean>(true);

  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [analysis, setAnalysis] = useState<PasswordResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const generatePassword = async () => {
    // Check validation: at least 1 category selected
    if (!useUpper && !useLower && !useNumbers && !useSpecial) {
      setErrorMsg('Please enable at least one character category.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length,
          uppercase: useUpper,
          lowercase: useLower,
          numbers: useNumbers,
          special: useSpecial,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to generate password`);
      }

      const data = await res.json();
      setGeneratedPassword(data.password);
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err: any) {
      console.error('[Generator Error]', err);
      setErrorMsg(err.message || 'Failed to generate password via Java SecureRandom.');
    } finally {
      setLoading(false);
    }
  };

  // Generate initial password on component mount
  useEffect(() => {
    generatePassword();
  }, []);

  const handleCopy = async () => {
    if (!generatedPassword) return;

    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const el = document.createElement('textarea');
      el.value = generatedPassword;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="generator" className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start gap-3.5 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Create a Strong Password</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generated via Java <span className="font-mono text-cyan-300">SecureRandom</span> and Fisher-Yates shuffle.
            </p>
          </div>
        </div>

        {/* Generated Password Monospace Display */}
        <div className="relative rounded-xl border border-indigo-500/30 bg-slate-950/80 p-4 shadow-inner">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Generated Output</div>
          <div className="flex items-center justify-between gap-3 min-h-[44px]">
            <span className="font-mono text-base sm:text-lg font-semibold tracking-wider text-cyan-300 break-all select-all">
              {generatedPassword || 'Click Generate Below'}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!generatedPassword}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-50"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={generatePassword}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-50"
                title="Regenerate password"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Copied Feedback Toast */}
          {copied && (
            <div className="absolute top-2 right-14 rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-slate-950 shadow-md animate-fade-in">
              Copied!
            </div>
          )}
        </div>

        {/* Strength Notice & Send to Checker option */}
        {analysis && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-950/40 px-3.5 py-2 text-xs border border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Strength:</span>
              <span className="font-semibold text-emerald-400">{analysis.strengthLevel}</span>
              <span className="text-slate-500 font-mono">({analysis.score}/100)</span>
            </div>

            {onSendToChecker && (
              <button
                type="button"
                onClick={() => onSendToChecker(generatedPassword)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Test in Checker</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Controls Section */}
        <div className="mt-6 space-y-5">
          {/* Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-slate-500" />
                <span>Password Length</span>
              </label>
              <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-300">
                {length} characters
              </span>
            </div>
            
            <input
              type="range"
              min={8}
              max={32}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
              <span>8 chars (Min)</span>
              <span>16 chars (Recommended)</span>
              <span>32 chars (Max)</span>
            </div>
          </div>

          {/* 4 Stylish Category Toggles */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Character Pools
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Uppercase */}
              <label className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                useUpper ? 'border-indigo-500/40 bg-indigo-500/10 text-white' : 'border-slate-800 bg-slate-950/40 text-slate-400'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={useUpper}
                    onChange={(e) => setUseUpper(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span>Uppercase Letters</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">A-Z</span>
              </label>

              {/* Lowercase */}
              <label className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                useLower ? 'border-indigo-500/40 bg-indigo-500/10 text-white' : 'border-slate-800 bg-slate-950/40 text-slate-400'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={useLower}
                    onChange={(e) => setUseLower(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span>Lowercase Letters</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">a-z</span>
              </label>

              {/* Numbers */}
              <label className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                useNumbers ? 'border-indigo-500/40 bg-indigo-500/10 text-white' : 'border-slate-800 bg-slate-950/40 text-slate-400'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={useNumbers}
                    onChange={(e) => setUseNumbers(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span>Numeric Digits</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">0-9</span>
              </label>

              {/* Special */}
              <label className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                useSpecial ? 'border-indigo-500/40 bg-indigo-500/10 text-white' : 'border-slate-800 bg-slate-950/40 text-slate-400'
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={useSpecial}
                    onChange={(e) => setUseSpecial(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span>Special Symbols</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">!@#$%</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            type="button"
            disabled={loading}
            onClick={generatePassword}
            className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating via Java SecureRandom...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Secure Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
