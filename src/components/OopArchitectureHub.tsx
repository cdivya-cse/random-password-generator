import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Terminal, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Play, 
  Copy, 
  Check, 
  ChevronRight, 
  Cpu, 
  ExternalLink,
  ShieldCheck,
  FileCode2
} from 'lucide-react';

export const OopArchitectureHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'classes' | 'code' | 'tests' | 'vscode'>('concepts');
  const [selectedFile, setSelectedFile] = useState<string>('PasswordChecker.java');
  const [sourceCodeMap, setSourceCodeMap] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  // Load Java source files from the backend API for inspection
  useEffect(() => {
    fetch('/api/source-code')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setSourceCodeMap(data.files);
        }
      })
      .catch((err) => console.error('Failed to load source files', err));
  }, []);

  const handleCopyCode = async () => {
    const code = sourceCodeMap[selectedFile];
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleTests = [
    {
      id: 'TC-01',
      title: 'Trivial Number Sequence',
      input: '12345',
      expectedLevel: 'Very Weak',
      expectedScore: '< 20',
      reason: 'Fails 8-character minimum, missing upper/special, sequential pattern penalty.',
    },
    {
      id: 'TC-02',
      title: 'Dictionary Word Pattern',
      input: 'password',
      expectedLevel: 'Very Weak',
      expectedScore: '20',
      reason: 'Length is 8, but heavily penalized for common dictionary word match.',
    },
    {
      id: 'TC-03',
      title: 'Standard Corporate Password',
      input: 'Admin123',
      expectedLevel: 'Weak',
      expectedScore: '40 - 50',
      reason: 'Contains 3 character pools, but lacks special characters and has low entropy.',
    },
    {
      id: 'TC-04',
      title: 'Balanced Passphrase',
      input: 'BlueSky#2026',
      expectedLevel: 'Medium / Strong',
      expectedScore: '70 - 80',
      reason: '12 characters, all 4 pools satisfied, moderate brute-force resistance.',
    },
    {
      id: 'TC-05',
      title: 'High-Entropy Cryptographic String',
      input: 'K#9xL$2mQ!vP8wZ1',
      expectedLevel: 'Very Strong',
      expectedScore: '100',
      reason: '16 characters, zero sequential patterns, maximum Shannon entropy.',
    },
  ];

  const runLiveTest = async (test: typeof sampleTests[0]) => {
    setRunningTestId(test.id);
    try {
      const res = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: test.input }),
      });
      const data = await res.json();
      setTestResults((prev) => ({ ...prev, [test.id]: data }));
    } catch (err: any) {
      setTestResults((prev) => ({ ...prev, [test.id]: { error: err.message } }));
    } finally {
      setRunningTestId(null);
    }
  };

  return (
    <section id="oop-docs" className="pt-16 pb-24 border-t border-slate-800/80 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-3">
            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
            <span>COLLEGE MINI-PROJECT &amp; VIVA SHOWCASE</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Java Object-Oriented Architecture
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Full technical documentation, OOP principles breakdown, live Java source code inspector, and ready-to-present viva test cases for students and professors.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl border border-slate-800 bg-slate-900/60 max-w-3xl mx-auto mb-10">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'concepts'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            OOP Principles
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'classes'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Class Roles
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Live Java Source Code
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'tests'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Viva Test Suite
          </button>
          <button
            onClick={() => setActiveTab('vscode')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'vscode'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            VS Code Run Guide
          </button>
        </div>

        {/* Tab 1: OOP Principles */}
        {activeTab === 'concepts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Encapsulation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold font-mono text-sm">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">Encapsulation</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Data hiding is enforced by marking sensitive state variables as <code className="text-indigo-300">private</code> in <code className="text-indigo-300">PasswordResult</code> and <code className="text-indigo-300">PasswordGenerator</code>. Access is permitted strictly through validated getters and setters.
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-300">
                <span className="text-indigo-400">// In PasswordResult.java</span>
                <br />
                <span className="text-rose-400">private</span> <span className="text-emerald-400">int</span> score;
                <br />
                <span className="text-rose-400">public void</span> <span className="text-cyan-300">setScore</span>(<span className="text-emerald-400">int</span> score) &#123;
                <br />
                &nbsp;&nbsp;<span className="text-indigo-400">// Bounds check [0, 100] prevents corrupted state</span>
                <br />
                &nbsp;&nbsp;<span className="text-rose-400">this</span>.score = Math.max(0, Math.min(100, score));
                <br />
                &#125;
              </div>
            </div>

            {/* 2. Abstraction */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold font-mono text-sm">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">Abstraction</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Complex cryptographic details—such as regular expression compiling, Shannon entropy math (<span className="font-mono text-slate-300">L &times; log<sub>2</sub>(N)</span>), and dictionary pattern searches—are hidden behind simple high-level methods.
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-300">
                <span className="text-indigo-400">// Clean abstraction in PasswordService.java</span>
                <br />
                <span className="text-rose-400">public</span> PasswordResult <span className="text-cyan-300">checkPassword</span>(String pwd) &#123;
                <br />
                &nbsp;&nbsp;<span className="text-indigo-400">// Caller has no need to know regex or entropy formulas</span>
                <br />
                &nbsp;&nbsp;<span className="text-rose-400">return</span> checker.check(pwd);
                <br />
                &#125;
              </div>
            </div>

            {/* 3. Polymorphism & Interfaces */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold font-mono text-sm">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">Polymorphism</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                The <code className="text-indigo-300">PasswordRule</code> interface establishes a polymorphic contract. Different criteria (length, uppercase, numbers, special characters) are evaluated uniformly in an extensible list without hardcoded branches.
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-300">
                <span className="text-indigo-400">// Polymorphic iteration in PasswordChecker.java</span>
                <br />
                <span className="text-rose-400">for</span> (PasswordRule rule : rules) &#123;
                <br />
                &nbsp;&nbsp;<span className="text-rose-400">if</span> (!rule.evaluate(password)) &#123;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;suggestions.add(rule.getSuggestion());
                <br />
                &nbsp;&nbsp;&#125;
                <br />
                &#125;
              </div>
            </div>

            {/* 4. Single Responsibility Principle */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 font-bold font-mono text-sm">
                  04
                </div>
                <h3 className="text-lg font-bold text-white">Single Responsibility</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Each class owns exactly one core responsibility: <code className="text-indigo-300">PasswordChecker</code> scores strength, <code className="text-indigo-300">PasswordGenerator</code> generates tokens with SecureRandom, and <code className="text-indigo-300">PasswordServer</code> manages HTTP sockets.
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-300">
                <span className="text-indigo-400">// Separation of Concerns:</span>
                <br />
                <span className="text-slate-300">PasswordServer</span>: Handles HTTP routes &amp; JSON I/O
                <br />
                <span className="text-slate-300">PasswordService</span>: Coordinates business operations
                <br />
                <span className="text-slate-300">PasswordChecker</span>: Evaluates security &amp; entropy
                <br />
                <span className="text-slate-300">PasswordGenerator</span>: SecureRandom generation
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Class Roles */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            {[
              {
                name: 'PasswordRule.java',
                type: 'Interface',
                role: 'Defines the polymorphic evaluation contract (evaluate, getSuggestion, getRuleName, getScoreWeight). Allows easy extension of new security rules.',
                keyMethods: ['boolean evaluate(String password)', 'String getSuggestion()'],
              },
              {
                name: 'PasswordChecker.java',
                type: 'Domain Engine',
                role: 'Accepts raw passwords, validates against rule criteria, calculates Shannon entropy, penalizes dictionary patterns, and returns an encapsulated PasswordResult.',
                keyMethods: ['PasswordResult check(String password)', 'double calculateEntropy()', 'String estimateCrackTime()'],
              },
              {
                name: 'PasswordGenerator.java',
                type: 'Cryptographic Engine',
                role: 'Generates secure passwords using java.security.SecureRandom. Guarantees character inclusion and distributes positions with Fisher-Yates shuffle.',
                keyMethods: ['String generate(int length, boolean upper, boolean lower, boolean num, boolean special)'],
              },
              {
                name: 'PasswordResult.java',
                type: 'POJO Model',
                role: 'Encapsulates analysis outputs (score, strengthLevel, meetsLength, boolean criteria, suggestions, entropy). Contains a zero-dependency toJson() method.',
                keyMethods: ['int getScore()', 'String getStrengthLevel()', 'String toJson()'],
              },
              {
                name: 'PasswordService.java',
                type: 'Service Facade',
                role: 'Coordinates checking and generation workflows. Decouples core business domain logic from HTTP networking.',
                keyMethods: ['PasswordResult checkPassword(String pwd)', 'String generatePassword(...)'],
              },
              {
                name: 'PasswordServer.java',
                type: 'HTTP Controller',
                role: 'Lightweight web server using com.sun.net.httpserver.HttpServer. Listens on port 8085, handles CORS, and exposes REST endpoints.',
                keyMethods: ['POST /api/check-password', 'POST /api/generate-password', 'GET /api/health'],
              },
            ].map((cls) => (
              <div key={cls.name} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <FileCode2 className="h-5 w-5 text-indigo-400" />
                    <span className="font-mono text-sm font-bold text-white">{cls.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {cls.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{cls.role}</p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
                  {cls.keyMethods.map((m) => (
                    <span key={m} className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Live Java Source Code Viewer */}
        {activeTab === 'code' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            {/* File Switcher Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  'PasswordChecker.java',
                  'PasswordGenerator.java',
                  'PasswordResult.java',
                  'PasswordRule.java',
                  'PasswordService.java',
                  'PasswordServer.java',
                ].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFile(f)}
                    className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                      selectedFile === f
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/api/download-zip"
                  download="random-password-checker.zip"
                  className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-600/30 px-3 py-1 text-xs font-medium text-indigo-200 hover:bg-indigo-600/50 hover:text-white transition-colors"
                  title="Download all Java & frontend files as ZIP archive"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Download Project ZIP</span>
                </a>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Source'}</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto max-h-[500px]">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                <code>{sourceCodeMap[selectedFile] || '// Loading Java source file from server...'}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Viva Test Suite */}
        {activeTab === 'tests' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-indigo-300 mb-4 flex items-center justify-between">
              <span>
                These test cases demonstrate each validation branch in your college project viva. Click <strong>"Test on Java Backend"</strong> to execute live.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sampleTests.map((test) => {
                const liveResult = testResults[test.id];
                return (
                  <div key={test.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {test.id}
                        </span>
                        <h4 className="text-sm font-bold text-white">{test.title}</h4>
                      </div>

                      <button
                        onClick={() => runLiveTest(test)}
                        disabled={runningTestId === test.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
                      >
                        <Play className="h-3 w-3" />
                        <span>{runningTestId === test.id ? 'Running...' : 'Test on Java Backend'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs">
                      <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                        <span className="text-[11px] text-slate-500 block">Input Password</span>
                        <span className="font-mono font-semibold text-cyan-300 mt-0.5 block">{test.input}</span>
                      </div>
                      <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                        <span className="text-[11px] text-slate-500 block">Expected Strength</span>
                        <span className="font-semibold text-amber-400 mt-0.5 block">{test.expectedLevel}</span>
                      </div>
                      <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                        <span className="text-[11px] text-slate-500 block">Expected Score</span>
                        <span className="font-mono font-semibold text-slate-300 mt-0.5 block">{test.expectedScore}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 italic mb-2">
                      <strong>Rationale:</strong> {test.reason}
                    </p>

                    {/* Live Java Output if executed */}
                    {liveResult && (
                      <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-mono">
                        <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-200">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Actual Output from Java Server:</span>
                        </div>
                        <div>
                          Score: <strong>{liveResult.score}/100</strong> &middot; Level: <strong>{liveResult.strengthLevel}</strong> &middot; Entropy: <strong>{liveResult.entropyBits} bits</strong> &middot; Crack Time: <strong>{liveResult.crackTimeDisplay}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: VS Code Run Guide */}
        {activeTab === 'vscode' && (
          <div className="space-y-6 max-w-4xl mx-auto text-xs text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-indigo-400" />
                Step-by-Step Terminal &amp; VS Code Guide
              </h3>
              <p className="text-slate-400 mb-4">
                To run the pure Java backend and standalone frontend in Visual Studio Code or any terminal:
              </p>

              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-white mb-1">Step 1: Check your Java installation</div>
                  <pre className="rounded-lg bg-slate-950 p-3 font-mono text-cyan-300 border border-slate-800">
                    javac -version && java -version
                  </pre>
                  <span className="text-slate-500">Requires OpenJDK 11, 17, or 21.</span>
                </div>

                <div>
                  <div className="font-semibold text-white mb-1">Step 2: Compile all Java source files</div>
                  <pre className="rounded-lg bg-slate-950 p-3 font-mono text-cyan-300 border border-slate-800">
                    mkdir -p bin{"\n"}javac -d bin src/*.java
                  </pre>
                </div>

                <div>
                  <div className="font-semibold text-white mb-1">Step 3: Launch the Java HttpServer on port 8085</div>
                  <pre className="rounded-lg bg-slate-950 p-3 font-mono text-cyan-300 border border-slate-800">
                    java -cp bin PasswordServer 8085
                  </pre>
                </div>

                <div>
                  <div className="font-semibold text-white mb-1">Step 4: Serve the Frontend</div>
                  <pre className="rounded-lg bg-slate-950 p-3 font-mono text-cyan-300 border border-slate-800">
                    # Inside the public/ directory:{"\n"}python3 -m http.server 3000
                  </pre>
                </div>
              </div>
            </div>

            {/* Common Errors & Solutions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-base font-bold text-white mb-3">Common Errors &amp; Solutions (Viva Questions)</h3>
              <div className="space-y-3">
                <div className="border-b border-slate-800 pb-2">
                  <div className="font-semibold text-rose-400">1. "Address already in use: bind"</div>
                  <div className="text-slate-400 mt-0.5">
                    Port 8085 is in use by another service. Either terminate that process or pass a custom port: <code className="text-slate-200">java -cp bin PasswordServer 9000</code>.
                  </div>
                </div>
                <div className="border-b border-slate-800 pb-2">
                  <div className="font-semibold text-rose-400">2. "javac: command not found"</div>
                  <div className="text-slate-400 mt-0.5">
                    JDK is not in PATH. Install OpenJDK (<code className="text-slate-200">sudo apt install openjdk-17-jdk</code>) and set <code className="text-slate-200">JAVA_HOME</code>.
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-rose-400">3. Why use SecureRandom instead of Math.random()?</div>
                  <div className="text-slate-400 mt-0.5">
                    <code className="text-slate-200">Math.random()</code> uses a Linear Congruential Formula (<code className="text-slate-200">java.util.Random</code>) which is deterministic and crackable within milliseconds. <code className="text-slate-200">SecureRandom</code> generates non-deterministic entropy from OS hardware noise (/dev/urandom).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
