import React, { useState } from 'react';

const Register = ({ onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.agree) {
      alert('Please agree to the Terms & Privacy to continue.');
      return;
    }

    console.log('Register form submitted:', form);
    if (onNavigate) onNavigate('login');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 flex items-center justify-center px-4 py-10 font-[Poppins]">
      <div className="max-w-5xl w-full grid gap-8 lg:grid-cols-2">

        {/* LEFT: marketing / hero block */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white p-8 md:p-10 shadow-[0_25px_70px_rgba(79,70,229,0.45)] flex flex-col justify-between transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(79,70,229,0.7)]">
          {/* glowing orbs */}
          <div className="pointer-events-none absolute -top-16 -right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl opacity-70 animate-pulse" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 w-52 h-52 rounded-full bg-pink-300/40 blur-3xl opacity-70 animate-[ping_4s_ease-in-out_infinite]" />

          <div className="relative">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-md">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-100 via-white to-cyan-100">
                Join EmotionLab
              </span>
            </h1>
            <p className="text-sm md:text-base opacity-95 max-w-md leading-relaxed">
              Create an account to track emotions, get personalized suggestions,
              and explore the dashboard — fast, private, and playful.
            </p>
          </div>

          <div className="relative mt-8 space-y-4">
            <div className="flex items-start gap-3 group">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-xl animate-bounce">🎯</span>
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <p className="font-semibold text-sm md:text-base">Real-time detection</p>
                <p className="text-xs md:text-sm opacity-90">
                  Fast & lightweight, designed for demos and prototyping.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <span className="text-xl">🔒</span>
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <p className="font-semibold text-sm md:text-base">Privacy first</p>
                <p className="text-xs md:text-sm opacity-90">
                  Frames stay local or on your consented server.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: form */}
        <section className="relative">
          {/* gradient border wrapper */}
          <div className="rounded-3xl bg-gradient-to-br from-cyan-300/70 via-sky-300/60 to-violet-400/70 p-[2px] shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl text-slate-800 p-6 md:p-8 flex flex-col">
              <header className="mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Create your{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500">
                    account
                  </span>
                </h2>
                <p className="mt-2 text-sm text-slate-500 max-w-xs">
                  It takes less than a minute. You can always change details later
                  from your profile.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                {/* Full name */}
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="block text-[0.7rem] md:text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm md:text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-300/60 focus:bg-white transition-all duration-200 shadow-sm"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-[0.7rem] md:text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm md:text-base outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/60 focus:bg-white transition-all duration-200 shadow-sm"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-[0.7rem] md:text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Choose a strong password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm md:text-base outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/60 focus:bg-white transition-all duration-200 shadow-sm"
                    required
                  />
                </div>

                {/* Terms + checkbox */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={form.agree}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-slate-400 text-emerald-500 focus:ring-emerald-400/70"
                  />
                  <label
                    htmlFor="agree"
                    className="text-xs md:text-sm text-slate-600 leading-relaxed"
                  >
                    I agree to the{' '}
                    <button
                      type="button"
                      className="font-semibold text-emerald-600 hover:text-emerald-500 underline underline-offset-2 decoration-emerald-400/70 transition-colors"
                      onClick={() => window.open('#', '_blank')}
                    >
                      Terms
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      className="font-semibold text-emerald-600 hover:text-emerald-500 underline underline-offset-2 decoration-emerald-400/70 transition-colors"
                      onClick={() => window.open('#', '_blank')}
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={!form.agree}
                    className={`relative overflow-hidden flex-1 rounded-2xl px-4 py-2.5 text-sm md:text-base font-semibold
                      bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500
                      text-white shadow-[0_12px_30px_rgba(56,189,248,0.45)]
                      transition-all duration-300 ease-out
                      hover:shadow-[0_16px_40px_rgba(56,189,248,0.7)]
                      hover:-translate-y-0.5 active:translate-y-[1px]
                      ${!form.agree ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                  >
                    <span className="relative z-10">Create account</span>
                    {/* shine effect */}
                    <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70 skew-x-[-20deg] group-hover:translate-x-[120%] transition-transform duration-700" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('login')}
                    className="flex-1 rounded-2xl px-4 py-2.5 text-sm md:text-base font-semibold border border-sky-200 bg-sky-50/70 hover:bg-white hover:border-sky-300 text-sky-700 transition-all duration-200"
                  >
                    Already have an account
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

export default Register;
