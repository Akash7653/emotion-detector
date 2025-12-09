import React, { useEffect, useRef, useState } from 'react';

const IconHome = ({ className = 'w-5 h-5' }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 11.5L12 4l9 7.5" />
    <path d="M5 12v7a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-7" />
  </svg>
);

const IconCamera = ({ className = 'w-5 h-5' }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconSun = ({ className = 'w-5 h-5' }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const IconMoon = ({ className = 'w-5 h-5' }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const IconLogout = ({ className = 'w-5 h-5' }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 17l-1.5-1.5L13 11H4" />
    <path d="M13 5l-4.5 4.5L10 11" />
    <path d="M15 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2" />
  </svg>
);

const Sidebar = ({
  onNavigate,
  onLogout,
  dark = false,
  onToggleMode,
  open = true,            // overlay open OR (ignored on desktop wrapper)
  onClose,
  isOverlay = false,
  collapsedDefault = false,
}) => {
  const containerRef = useRef(null);

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebarCollapsed') === 'true' || collapsedDefault;
    } catch {
      return collapsedDefault;
    }
  });

  // Persist collapse state for desktop version
  useEffect(() => {
    if (isOverlay) return;
    try {
      localStorage.setItem('sidebarCollapsed', collapsed ? 'true' : 'false');
    } catch {}
  }, [collapsed, isOverlay]);

  // Focus trap + ESC for overlay only
  useEffect(() => {
    if (!isOverlay) return;

    let previousActive = null;

    function getFocusableElements() {
      if (!containerRef.current) return [];
      const selector =
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return Array.from(containerRef.current.querySelectorAll(selector)).filter(
        (el) => el.offsetParent !== null
      );
    }

    function handleKeyDown(e) {
      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose && onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    if (open) {
      previousActive = document.activeElement;
      setTimeout(() => {
        const elems = getFocusableElements();
        if (elems.length) elems[0].focus();
      }, 0);
      document.addEventListener('keydown', handleKeyDown);
      document.querySelector('main')?.setAttribute('aria-hidden', 'true');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.querySelector('main')?.removeAttribute('aria-hidden');
      if (previousActive && previousActive.focus) previousActive.focus();
    };
  }, [open, isOverlay, onClose]);

  const isCollapsedDesktop = !isOverlay && collapsed;

  const widthClasses = isCollapsedDesktop ? 'w-20' : 'w-72';

  const desktopClasses = `
    h-screen p-4 rounded-r-lg bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500
    text-white shadow-xl flex flex-col transition-all duration-300 ease-out sticky top-0
  `;

  const overlayClasses = `
    fixed inset-y-0 left-0 h-screen p-4 rounded-r-lg bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500
    text-white shadow-xl flex flex-col transition-transform duration-300 ease-out z-50
    ${open ? 'translate-x-0' : '-translate-x-full'}
  `;

  const labelClass = (extra = '') =>
    `sidebar-label font-medium whitespace-nowrap transition-all duration-200 ${
      isCollapsedDesktop ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
    } ${extra}`;

  const showBackdrop = isOverlay && open;

  return (
    <>
      {showBackdrop && (
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 opacity-100"
          onClick={onClose}
        />
      )}

      <aside
        ref={containerRef}
        role={isOverlay ? 'dialog' : 'complementary'}
        aria-label="Main navigation"
        aria-modal={isOverlay ? 'true' : undefined}
        className={`${isOverlay ? overlayClasses : desktopClasses} ${widthClasses}`}
      >
        <div className="flex items-center justify-between mb-4">
          {/* Brand */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate && onNavigate('home');
              onClose && onClose();
            }}
            className="sidebar-brand-button sidebar-brand flex items-center gap-3 text-left"
            aria-label="Go to home"
          >
            <div className="logo-wrap" aria-hidden>
              <img src="/logo.svg" alt="EmotionLab logo" className="brand-logo" />
            </div>
            <div
              className={`brand-text transition-all duration-200 ${
                isCollapsedDesktop ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
            >
              <div className="brand-name">EmotionLab</div>
              <div className="brand-sub text-xs opacity-80">Realtime AI</div>
            </div>
          </button>

          {/* Triangle collapse toggle – desktop only */}
          {!isOverlay && (
            <button
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-pressed={collapsed}
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed((prev) => !prev);
              }}
              className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/25"
            >
              <svg
                className={`transition-transform duration-200 ${
                  collapsed ? 'rotate-180' : 'rotate-0'
                }`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6V6z" fill="currentColor" />
              </svg>
            </button>
          )}

          {/* Close button – overlay only */}
          {isOverlay && (
            <button
              aria-label="Close sidebar"
              className="lg:hidden px-2 py-1 rounded text-white"
              onClick={onClose}
            >
              ✕
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-3 mt-2">
          <button
            onClick={() => {
              onNavigate('home');
              onClose && onClose();
            }}
            className={`app-sidebar-button text-left p-3 rounded-lg bg-transparent hover:bg-white/10 flex items-center ${
              isCollapsedDesktop ? 'justify-center' : 'justify-start gap-3'
            }`}
            aria-label="Go to Home"
          >
            <IconHome />
            <span className={labelClass()}>Home</span>
          </button>

          <button
            onClick={() => {
              onNavigate('dashboard');
              onClose && onClose();
            }}
            className={`app-sidebar-button text-left p-3 rounded-lg bg-transparent hover:bg-white/10 flex items-center ${
              isCollapsedDesktop ? 'justify-center' : 'justify-start gap-3'
            }`}
            aria-label="Open Dashboard"
          >
            <IconCamera />
            <span className={labelClass()}>Dashboard</span>
          </button>

          <button
            onClick={() => {
              onToggleMode && onToggleMode();
              onClose && onClose();
            }}
            title="Toggle theme"
            className={`app-sidebar-button text-left p-3 rounded-lg bg-transparent hover:bg-white/10 flex items-center ${
              isCollapsedDesktop ? 'justify-center' : 'justify-start gap-3'
            }`}
            aria-label="Toggle theme"
          >
            {dark ? <IconMoon /> : <IconSun />}
            <span className={labelClass()}>Theme</span>
          </button>
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={() => {
              onLogout && onLogout();
              onClose && onClose();
            }}
            className={`sidebar-logout px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold flex items-center
              ${isCollapsedDesktop ? 'justify-center w-full' : 'justify-center gap-2 w-full'}
            `}
            aria-label="Logout"
          >
            <IconLogout />
            <span className={labelClass()}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
