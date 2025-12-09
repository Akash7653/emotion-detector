// src/pages/Home.js
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';

const EMOTIONS = [
  { key: 'happy', name: 'Happy', emoji: '😊', color: 'from-yellow-400 to-yellow-500', description: 'A positive affective state associated with pleasure and contentment.', suggestions: ['Listen to upbeat music', 'Share a smile', 'Capture this moment'] },
  { key: 'sad', name: 'Sad', emoji: '😢', color: 'from-blue-500 to-indigo-500', description: 'A low mood state often triggered by loss, disappointment, or introspection.', suggestions: ['Reach out to a friend', 'Try soothing music', 'Practice gentle breathing'] },
  { key: 'angry', name: 'Angry', emoji: '😠', color: 'from-red-500 to-red-600', description: 'Heightened arousal with negative valence, often due to perceived wrongs.', suggestions: ['Take a short walk', 'Count to ten', 'Try grounding exercises'] },
  { key: 'surprised', name: 'Surprised', emoji: '😮', color: 'from-pink-400 to-pink-500', description: 'A state of sudden astonishment that can be positive or negative.', suggestions: ['Pause and reflect', 'Capture the moment', 'Ask questions'] },
  { key: 'fear', name: 'Fear', emoji: '😨', color: 'from-gray-600 to-gray-700', description: 'An anticipatory reaction to threat with protective behavior.', suggestions: ['Slow your breathing', 'Identify the trigger', 'Seek support if needed'] },
  { key: 'disgust', name: 'Disgust', emoji: '🤢', color: 'from-emerald-400 to-emerald-500', description: 'A strong aversion often linked to contamination or moral rejection.', suggestions: ['Step away from the source', 'Reflect on boundaries', 'Practice self-care'] },
  { key: 'neutral', name: 'Neutral', emoji: '😐', color: 'from-slate-400 to-slate-500', description: 'An affective baseline with no strong positive or negative valence.', suggestions: ['Engage in productive tasks', 'Take a short break', 'Observe without judgment'] },
  { key: 'excited', name: 'Excited', emoji: '🤩', color: 'from-orange-400 to-orange-500', description: 'High energy, positive anticipation or enthusiasm.', suggestions: ['Channel energy into creativity', 'Share your excitement', 'Plan next steps'] },
  { key: 'anxious', name: 'Anxious', emoji: '😰', color: 'from-purple-500 to-pink-500', description: 'Worry and tension often about future events.', suggestions: ['Try a grounding technique', 'Limit stimulants', 'Write down worries'] },
  { key: 'bored', name: 'Bored', emoji: '😒', color: 'from-indigo-400 to-indigo-500', description: 'Low arousal and dissatisfaction with current activity.', suggestions: ['Try a new micro-task', 'Switch to a creative activity', 'Take a quick walk'] },
  { key: 'frustrated', name: 'Frustrated', emoji: '😤', color: 'from-red-400 to-red-500', description: 'Blocked goals producing irritation or anger.', suggestions: ['Step back and reframe', 'Break tasks into steps', 'Seek help if stuck'] },
  { key: 'proud', name: 'Proud', emoji: '😌', color: 'from-yellow-500 to-amber-500', description: 'Positive appraisal of personal achievement.', suggestions: ['Celebrate the win', 'Log it in a journal', 'Share with loved ones'] },
  { key: 'embarrassed', name: 'Embarrassed', emoji: '😳', color: 'from-pink-300 to-pink-400', description: 'Self-conscious discomfort often after a social mishap.', suggestions: ['Laugh it off', 'Apologize if needed', 'Remember it will pass'] },
  { key: 'curious', name: 'Curious', emoji: '🤔', color: 'from-cyan-400 to-cyan-500', description: 'Interest and willingness to learn or explore.', suggestions: ['Ask a question', 'Explore a new topic', 'Bookmark for later'] },
  { key: 'calm', name: 'Calm', emoji: '😌', color: 'from-teal-300 to-teal-400', description: 'A peaceful, low-arousal state conducive to reflection.', suggestions: ['Deep breathing', 'Mindfulness', 'Savor the moment'] },
  { key: 'love', name: 'Love', emoji: '😍', color: 'from-pink-500 to-rose-500', description: 'Affection and strong positive attachment.', suggestions: ['Reach out to someone you care about', 'Express appreciation', 'Spend quality time'] },
  { key: 'disappointed', name: 'Disappointed', emoji: '😞', color: 'from-stone-400 to-stone-500', description: 'Unmet expectations causing sadness or regret.', suggestions: ['Re-evaluate expectations', 'Practice self-compassion', 'Plan next steps'] },
];

// extra info for the "Explore more" section
const FEATURE_DETAILS = {
  usecases: {
    heading: 'Use Cases: Where EmotionLab Fits',
    intro:
      'Emotion recognition is not just a cool demo. It can unlock better experiences and safer interactions when used carefully.',
    bullets: [
      'Accessibility & assistive tech — adapt interfaces for users who appear confused, frustrated, or overwhelmed.',
      'Mental health check-ins — give gentle nudges like “take a break” or “try a breathing exercise” (never a diagnosis).',
      'Adaptive UX — change difficulty, visuals, or hints in learning apps and games based on the user’s emotional state.',
      'User research & usability labs — understand how people actually feel while using your product, not just what they say.',
    ],
    note: 'Always combine emotion data with explicit consent and clear explanations of how the information is used.',
  },
  'best-practices': {
    heading: 'Best Practices: Using Emotion Data Responsibly',
    intro:
      'Emotions are sensitive. Treat them like any other personal data. These guidelines help you stay on the safe, respectful side.',
    bullets: [
      'Consent first — clearly inform users when the camera is used and why, and allow them to opt out at any time.',
      'No hidden recording — avoid saving raw video frames unless absolutely necessary and always disclose if you do.',
      'Minimize storage — prefer real-time processing over long-term storage of emotion or face data.',
      'Avoid high-stakes decisions — do not use this demo for hiring, grading, policing, or any critical judgments.',
      'Be transparent — explain model limitations, potential biases, and that predictions can be wrong.',
    ],
    note: 'Think of EmotionLab as a prototyping and learning tool, not a final decision-maker about people.',
  },
  contribute: {
    heading: 'Get Involved: Help Improve EmotionLab',
    intro:
      'This kind of project grows best when people share feedback, ideas, and improvements. You can contribute in many ways.',
    bullets: [
      'Report bugs or weird behaviour you notice during detection sessions.',
      'Suggest new use cases or UI improvements that make the feedback more helpful.',
      'Experiment with different models or datasets and share your observations.',
      'Help review text, labels, and suggestions so they feel kind, inclusive, and non-judgmental.',
      'If you are a developer, extend the dashboard, logging, or visualizations and share your changes.',
    ],
    note: 'Even simple feedback such as “this felt confusing” or “this message helped me” is already a valuable contribution.',
  },
};

const Home = ({ onNavigate, dark, onToggleMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);     // mobile overlay
  const [sidebarHidden, setSidebarHidden] = useState(false); // lg/xl scroll-hide
  const [openKeys, setOpenKeys] = useState(() => new Set());
  const [activeFeature, setActiveFeature] = useState('usecases'); // for Explore more panel
  const lastScrollY = useRef(0);

  function toggleDetails(key) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Desktop (lg+) scroll behavior: down -> hide sidebar, up -> show sidebar
  useEffect(() => {
    function handleScroll() {
      if (window.innerWidth < 1024) return;

      const current = window.scrollY;
      const delta = current - lastScrollY.current;

      if (delta > 10 && !sidebarHidden) {
        setSidebarHidden(true);
      } else if (delta < -10 && sidebarHidden) {
        setSidebarHidden(false);
      }

      lastScrollY.current = current;
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sidebarHidden]);

  const detail = FEATURE_DETAILS[activeFeature];

  return (
    <div className="min-h-screen w-full bg-white flex overflow-hidden">
      {/* Mobile / medium top bar with gradient hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 px-4 py-2 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-start">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-semibold active:scale-95 transition-transform shadow-md"
        >
          <span className="text-lg leading-none">☰</span>
          <span>Menu</span>
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div
        className={`hidden lg:block transition-transform duration-300 ${
          sidebarHidden ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <Sidebar
          onNavigate={onNavigate}
          onLogout={() => onNavigate('login')}
          dark={dark}
          onToggleMode={onToggleMode}
          isOverlay={false}
        />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen px-4 pb-10 pt-16 lg:pt-0 mt-0 overflow-y-auto">
        {/* HERO */}
        <section className="mb-8 mt-0">
          <div className="hero-banner rounded-xl p-12 shadow-2xl">
            <h1 className="text-5xl font-extrabold mb-4 leading-tight hero-title">
              Understanding Emotions — A Visual Guide
            </h1>
            <p className="text-lg opacity-90 max-w-3xl hero-text">
              Explore a rich palette of emotions, learn brief descriptions, and get quick practical suggestions.
              Click any card to expand details and suggestions. This interactive guide complements the real-time
              emotion detector.
            </p>
          </div>
        </section>

        {/* Emotional spectrum */}
        <section className="emotions-section">
          {/* EMOTIONAL SPECTRUM – yellow/orange gradient text visible on light & dark */}
          <h2
            className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 bg-clip-text text-transparent"
          >
            Emotional Spectrum
          </h2>

          <div className="emotions-grid">
            {EMOTIONS.map((emo, idx) => {
              const delay = `${idx * 40}ms`;
              const opened = openKeys.has(emo.key);
              return (
                <article
                  key={emo.key}
                  className="emotion-card"
                  style={{ animationDelay: delay }}
                  onClick={() => toggleDetails(emo.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') toggleDetails(emo.key);
                  }}
                >
                  <div className={`card-top bg-gradient-to-br ${emo.color}`}>
                    <div className="emoji">{emo.emoji}</div>
                    <div className="title">{emo.name}</div>
                  </div>
                  <div className="card-body">
                    <p className="desc">{emo.description}</p>
                    <div className={`card-details ${opened ? 'open' : ''}`}>
                      <h4 className="mt-3 font-semibold">Suggestions</h4>
                      <ul className="mt-2 suggestion-list">
                        {emo.suggestions.map((s, i) => (
                          <li key={i} className="suggestion">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Explore more – stays on this page */}
        <section className="mt-12">
          <div className="p-8 rounded-lg bg-white/5 border shadow-inner">
            <h3 className="text-2xl font-bold mb-4">Explore more</h3>
            <p className="mb-6 opacity-90">
              Dive deeper into practical applications, ethical guidelines, and ways to contribute. Click a card
              to see more information below – everything stays on this page.
            </p>

            {/* 3 TOP CARDS – gradient backgrounds (green / yellow / orange) */}
            <div className="feature-grid">
              {[
                {
                  id: 'usecases',
                  title: 'Use Cases',
                  desc: 'See real-world scenarios where emotion recognition adds value — accessibility, mental health, and adaptive UX.',
                  cta: 'Explore',
                  icon: 'search',
                  bg: 'linear-gradient(135deg,#22c55e,#a3e635)', // green
                },
                {
                  id: 'best-practices',
                  title: 'Best Practices',
                  desc: 'Guidelines on ethics, consent, and privacy to help you deploy responsibly.',
                  cta: 'Guidelines',
                  icon: 'doc',
                  bg: 'linear-gradient(135deg,#facc15,#fb923c)', // yellow/orange
                },
                {
                  id: 'contribute',
                  title: 'Get Involved',
                  desc: 'Contribute, report issues, or suggest datasets and models to improve the project.',
                  cta: 'Contribute',
                  icon: 'handshake',
                  bg: 'linear-gradient(135deg,#fb923c,#f97316)', // orange
                },
              ].map((f, i) => {
                const delay = `${i * 80}ms`;
                const isActive = activeFeature === f.id;

                const selectFeature = () => setActiveFeature(f.id);

                return (
                  <div
                    key={f.id}
                    className={`feature-card text-slate-50 ${isActive ? 'feature-card-active ring-2 ring-offset-2 ring-offset-slate-100/60 ring-amber-400' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={selectFeature}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') selectFeature();
                    }}
                    style={{ animationDelay: delay, backgroundImage: f.bg }}
                  >
                    <div className="feature-card-inner">
                      <div className="feature-icon" aria-hidden>
                        {f.icon === 'search' && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M21 21l-4.35-4.35"
                              stroke="#fef9c3"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="11"
                              cy="11"
                              r="6"
                              stroke="#fef9c3"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {f.icon === 'doc' && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                              stroke="#fef9c3"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 2v6h6"
                              stroke="#fef9c3"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {f.icon === 'handshake' && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M21 12l-4.35 4.35a2 2 0 0 1-2.83 0L9 12"
                              stroke="#fffbeb"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 7l3 3 4-4"
                              stroke="#fffbeb"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <h4 className="feature-title text-slate-50">
                        {f.title}
                      </h4>
                      <p className="feature-desc text-slate-100/90">
                        {f.desc}
                      </p>
                      <div className="feature-cta bg-slate-50/90 text-amber-700 mt-3 inline-block px-4 py-1 rounded-full text-sm font-semibold">
                        {f.cta}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DETAIL PANEL CARD – yellow/orange gradient */}
            <div
              className="mt-8 rounded-2xl border shadow-lg p-6 md:p-7 text-slate-900"
              style={{
                backgroundImage: 'linear-gradient(135deg,#fef9c3,#fed7aa)',
                borderColor: '#fed7aa',
              }}
            >
              <h4 className="text-xl font-semibold mb-2">
                {detail.heading}
              </h4>
              <p className="text-sm md:text-base text-slate-800 mb-4">
                {detail.intro}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-900">
                {detail.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs md:text-sm text-amber-800 italic">
                {detail.note}
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="app-footer mt-12">
          <div className="footer-inner p-8 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-lg">EmotionLab</h4>
                <p className="mt-2 opacity-90">
                  Realtime emotion recognition demo — built for research and prototyping. Respect privacy and obtain
                  consent.
                </p>
              </div>
              <div>
                <h5 className="font-semibold">Resources</h5>
                <ul className="mt-2 opacity-90">
                  <li>Docs</li>
                  <li>Privacy</li>
                  <li>Terms</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold">Contact</h5>
                <p className="mt-2 opacity-90">contact@emotionlab.example</p>
              </div>
            </div>
            <div className="mt-6 text-sm opacity-80">
              © {new Date().getFullYear()} EmotionLab — All rights reserved
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile / medium overlay sidebar */}
      <Sidebar
        onNavigate={onNavigate}
        onLogout={() => onNavigate('login')}
        dark={dark}
        onToggleMode={onToggleMode}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isOverlay={true}
      />
    </div>
  );
};

export default Home;
