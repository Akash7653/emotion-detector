import React, { useState } from 'react';

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onNavigate('home');
    }, 700);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 flex items-center justify-center px-4 py-10 font-[Poppins]">
      <div className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white p-8 md:p-10 shadow-[0_25px_70px_rgba(79,70,229,0.45)] flex flex-col gap-8">
          {/* glowing shapes */}
          <div className="pointer-events-none absolute -top-16 -right-10 w-40 h-40 rounded-full bg-white/25 blur-3xl opacity-70 animate-pulse" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 w-52 h-52 rounded-full bg-blue-300/40 blur-3xl opacity-70 animate-[ping_4s_ease-in-out_infinite]" />

          {/* welcome text */}
          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 text-xs md:text-sm px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              Signed-in sessions stay synced across devices
            </p>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-1 leading-tight tracking-tight drop-shadow-md"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-100 via-white to-cyan-100">
                Welcome back
              </span>{' '}
              👋
            </h1>

            <p className="text-sm md:text-base opacity-95 max-w-md leading-relaxed">
              Sign in to continue using EmotionLab, review emotion history,
              and jump straight into real-time detection without missing a beat.
            </p>

            {/* chips row */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs md:text-[0.8rem]">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/25">
                ⚡ Resume last session
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/25">
                📈 View insights
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/25">
                🔔 Smart alerts
              </span>
            </div>
          </div>

          {/* small stats row */}
          <div className="relative grid grid-cols-3 gap-4 text-xs md:text-sm">
            <div className="bg-white/15 rounded-2xl px-3 py-3 backdrop-blur-md border border-white/20">
              <p className="text-[0.65rem] uppercase tracking-[0.16em] opacity-80">
                Avg. sessions
              </p>
              <p className="text-lg md:text-xl font-semibold">4 / day</p>
            </div>
            <div className="bg-white/15 rounded-2xl px-3 py-3 backdrop-blur-md border border-white/20">
              <p className="text-[0.65rem] uppercase tracking-[0.16em] opacity-80">
                Retention
              </p>
              <p className="text-lg md:text-xl font-semibold">92%</p>
            </div>
            <div className="bg-white/15 rounded-2xl px-3 py-3 backdrop-blur-md border border-white/20">
              <p className="text-[0.65rem] uppercase tracking-[0.16em] opacity-80">
                Countries
              </p>
              <p className="text-lg md:text-xl font-semibold">40+</p>
            </div>
          </div>

          {/* features */}
          <div className="relative mt-2 space-y-4">
            <div className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-xl">⚡</span>
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <h4 className="font-semibold text-sm md:text-base">Instant feedback</h4>
                <p className="text-xs md:text-sm opacity-90">
                  See emotion labels update live as your camera streams.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <span className="text-xl">🔐</span>
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <h4 className="font-semibold text-sm md:text-base">Secure by design</h4>
                <p className="text-xs md:text-sm opacity-90">
                  Your frames stay local or on your consented server — never shared.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: login form */}
        <section className="relative">
          {/* gradient border wrapper */}
          <div className="rounded-3xl bg-gradient-to-br from-cyan-300/70 via-sky-300/60 to-violet-400/70 p-[2px] shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
            <div className="rounded-3xl bg-white/95 backdrop-blur-xl text-slate-800 p-6 md:p-8 flex flex-col">
              <header className="mb-6">
                <h2
                  className="text-2xl md:text-3xl font-extrabold tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Sign in to{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500">
                    EmotionLab
                  </span>
                </h2>
                <p className="mt-2 text-sm text-slate-500 max-w-xs">
                  Access live detection, your saved sessions, and personalized suggestions.
                </p>
              </header>

              <form onSubmit={submit} className="space-y-4 flex-1 flex flex-col">
                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[0.7rem] md:text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    type="email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm md:text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-300/60 focus:bg-white transition-all duration-200 shadow-sm"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-[0.7rem] md:text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    type="password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm md:text-base outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/60 focus:bg-white transition-all duration-200 shadow-sm"
                    required
                  />
                </div>

                {/* Small extra row */}
                <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 pt-1">
                  <span>Use the same email you registered with.</span>
                  <button
                    type="button"
                    className="font-semibold text-sky-600 hover:text-sky-500 underline underline-offset-2"
                    onClick={() => alert('Reset flow not wired yet.')}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative overflow-hidden flex-1 rounded-2xl px-4 py-2.5 text-sm md:text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white shadow-[0_12px_30px_rgba(56,189,248,0.45)] transition-all duration-300 ease-out hover:shadow-[0_16px_40px_rgba(56,189,248,0.7)] hover:-translate-y-0.5 active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {submitting ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Signing in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </span>
                    {/* shine effect */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70 skew-x-[-20deg] group-hover:translate-x-[120%] transition-transform duration-700" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="flex-1 rounded-2xl px-4 py-2.5 text-sm md:text-base font-semibold border border-sky-200 bg-sky-50/70 hover:bg-white hover:border-sky-300 text-sky-700 transition-all duration-200"
                  >
                    Create account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
