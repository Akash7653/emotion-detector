// src/pages/Dashboard.js
import React from 'react';
import EmotionDetector from '../components/EmotionDetector';

const Dashboard = ({ onNavigate, dark, onToggleMode }) => {
  const handleBackHome = () => onNavigate('home');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 px-4 py-6 md:py-10 font-[Poppins] flex items-stretch justify-center">
      <div className="max-w-6xl w-full flex flex-col gap-6">

        {/* Top bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          <button
            type="button"
            onClick={handleBackHome}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm md:text-base font-semibold bg-white/80 text-slate-800 border border-slate-200 shadow-md hover:bg-white hover:-translate-y-0.5 active:translate-y-[1px] transition-all"
          >
            <span className="text-lg">←</span>
            <span>Back to home</span>
          </button>

          <div className="text-left md:text-right">
            <h1
              className="text-xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 justify-start md:justify-end"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              EmotionLab
              <span className="inline-block rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 text-white text-xs md:text-sm font-semibold px-3 py-1 shadow-sm">
                Dashboard
              </span>
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-500 max-w-md md:ml-auto">
              Monitor live emotions, test models, and explore real-time detection with your webcam.
            </p>
          </div>
        </header>

        {/* Small stats strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/80 border border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-lg">
              🎥
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                Camera
              </p>
              <p className="text-xs sm:text-sm text-slate-700">
                Enable webcam to start live detection.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 border border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-lg">
              🧠
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                Model
              </p>
              <p className="text-xs sm:text-sm text-slate-700">
                CNN · 48×48 grayscale faces · multi-class emotions.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 border border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-lg">
              ⚡
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                Tip
              </p>
              <p className="text-xs sm:text-sm text-slate-700">
                Face the camera directly in good lighting for best results.
              </p>
            </div>
          </div>
        </section>

        {/* Main area: detector + side panel */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] gap-6 items-stretch">
          {/* Detection card */}
          <div className="w-full rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.18)] p-4 sm:p-6 md:p-7 flex flex-col">
            {/* card header */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg md:text-2xl font-semibold text-slate-900">
                  Live Detection
                </h2>
                <p className="text-xs md:text-sm text-slate-500">
                  Allow camera access to start real-time emotion tracking and overlays.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live
              </span>
            </div>

            {/* detector area */}
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-3 sm:p-4 md:p-5 shadow-inner min-h-[320px] md:min-h-[420px] overflow-hidden">
              <div className="h-full w-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
                <EmotionDetector />
              </div>
            </div>

            <p className="mt-3 text-[0.7rem] md:text-xs text-slate-500 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
              Tip: keep your face centered and avoid strong back-light for more stable predictions.
            </p>
          </div>

          {/* Side panel with legend / quick info */}
          <aside className="w-full flex flex-col gap-4">
            {/* emotion legend */}
            <div className="rounded-3xl bg-white/90 border border-slate-100 shadow-md p-4 sm:p-5 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-base">
                  🙂
                </span>
                Emotion legend
              </h3>
              <p className="text-[0.7rem] md:text-xs text-slate-500">
                The model predicts one of several basic emotions. Use this as a quick reference while testing.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[0.7rem] md:text-xs text-slate-700">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1">
                  😊 <span>Happy</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1">
                  😢 <span>Sad</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1">
                  😠 <span>Angry</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1">
                  😮 <span>Surprised</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1">
                  😨 <span>Fear</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1">
                  🤢 <span>Disgust</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1">
                  😐 <span>Neutral</span>
                </span>
              </div>
            </div>

            {/* usage notes */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg p-4 sm:p-5 flex flex-col gap-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center text-lg">
                  ⚙️
                </span>
                Best practice
              </h3>
              <ul className="text-[0.7rem] md:text-xs space-y-1.5 opacity-95">
                <li>• Ask for consent before capturing anyone’s video or face.</li>
                <li>• Use this dashboard only for demos, experiments, and learning.</li>
                <li>• Avoid storing raw frames or predictions without a clear policy.</li>
              </ul>

              <button
                type="button"
                onClick={onToggleMode}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-white/90 text-indigo-700 text-xs font-semibold px-4 py-2 hover:bg-white transition"
              >
                {dark ? 'Switch to light mode' : 'Switch to dark mode'}
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
