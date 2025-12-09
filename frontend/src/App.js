import React, { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [route, setRoute] = useState('register'); // open register page first
  const [dark, setDark] = useState(false);

  const go = (r) => setRoute(r);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [dark]);

  return (
    <div className={dark ? 'min-h-screen bg-gray-900 text-gray-100' : 'min-h-screen bg-gray-50 text-gray-900'}>
      {route !== 'register' && route !== 'login' && route !== 'home' && route !== 'dashboard' && (
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">EmotionLab</h1>
            <span className="text-sm opacity-80">Real-time facial emotion detection • 62% model accuracy</span>
          </div>

          <nav className="flex items-center gap-3">
            <button className="px-3 py-1 rounded hover:bg-gray-200" onClick={() => go('home')}>Home</button>
            <button className="px-3 py-1 rounded hover:bg-gray-200" onClick={() => go('dashboard')}>Dashboard</button>
            <button className="px-3 py-1 rounded hover:bg-gray-200" onClick={() => go('login')}>Login</button>
            <button className="px-3 py-1 rounded hover:bg-gray-200" onClick={() => go('register')}>Register</button>
            <button
              onClick={() => setDark(!dark)}
              className="ml-4 px-3 py-1 rounded bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
            >
              {dark ? 'Light' : 'Dark'}
            </button>
          </nav>
        </header>
      )}

      <main className="p-6">
        {route === 'home' && <Home onNavigate={go} dark={dark} onToggleMode={() => setDark(!dark)} />}
        {route === 'login' && <Login onNavigate={go} />}
        {route === 'register' && <Register onNavigate={go} />}
        {route === 'dashboard' && <Dashboard onNavigate={go} dark={dark} onToggleMode={() => setDark(!dark)} />}
      </main>
    </div>
  );
}

export default App;
