import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Logo, LogoutBtn } from '../index';

function Header() {
  const authStatus  = useSelector((state) => state.auth.status);
  const userData    = useSelector((state) => state.auth.userData);
  const navigate    = useNavigate();
  const location    = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled,  setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navItems = [
    { name: 'Home',      slug: '/',          active: true           },
    { name: 'Explore',   slug: '/all-posts', active: authStatus     },
    { name: 'Profile',   slug: '/profile',   active: authStatus     },
    { name: 'Login',     slug: '/login',     active: !authStatus    },
    { name: 'Sign up',   slug: '/signup',    active: !authStatus    },
  ];

  const isActive = (slug) => location.pathname === slug;

  const getHeaderTheme = () => {
    if (scrolled) return { bg: 'bg-white', text: 'text-brand-dark', border: 'shadow-sm border-gray-200' };
    
    const path = location.pathname;
    if (path === '/') return { bg: 'bg-brand-yellow', text: 'text-brand-dark', border: 'border-transparent' };
    if (path === '/all-posts' || path === '/signup') return { bg: 'bg-brand-purple', text: 'text-white', border: 'border-transparent' };
    if (path === '/profile' || path === '/login') return { bg: 'bg-brand-pink', text: 'text-white', border: 'border-transparent' };
    if (path.startsWith('/add-post') || path.startsWith('/edit-post')) return { bg: 'bg-brand-orange', text: 'text-white', border: 'border-transparent' };
    
    // Default to transparent so it melts into any page background (gray-50, etc)
    return { bg: 'bg-transparent', text: 'text-brand-dark', border: 'border-transparent' };
  };

  const theme = getHeaderTheme();

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${theme.bg} ${theme.border}`}
    >
      <Container>
        <nav className="flex items-center justify-between h-[72px]">

          {/* ── Brand ──────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Thoughts home">
            <Logo className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
            <span className={`text-[22px] font-black tracking-tighter transition-colors ${theme.text === 'text-white' ? 'text-white group-hover:text-white/80' : 'text-brand-dark group-hover:text-brand-purple'}`}>
              Thoughts
            </span>
          </Link>

          {/* ── Desktop Nav ────────────────────────── */}
          <ul className="hidden md:flex items-center gap-1 ml-auto">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`
                      px-4 py-2 text-sm font-bold rounded-full transition-all duration-200
                      ${isActive(item.slug)
                        ? (theme.text === 'text-white' ? 'bg-white/20 text-white' : 'text-brand-purple bg-purple-50')
                        : (theme.text === 'text-white' ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-brand-dark hover:bg-gray-50')}
                    `}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {authStatus && (
              <>
                <li>
                  <button
                    onClick={() => navigate('/add-post')}
                    className={`ml-1 px-5 py-2 text-sm font-black rounded-full hover:shadow-brand-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200
                                ${theme.text === 'text-white' ? 'bg-white text-brand-dark hover:bg-gray-100' : 'bg-brand-purple text-white hover:bg-purple-700'}
                    `}
                  >
                    Write
                  </button>
                </li>
                <li className="ml-2">
                  <LogoutBtn className={theme.text === 'text-white' ? 'text-white/80 hover:text-white hover:bg-white/20' : ''} />
                </li>
              </>
            )}
          </ul>

          {/* ── Mobile Hamburger ───────────────────── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden p-2 rounded-xl transition-colors ${theme.text === 'text-white' ? 'text-white hover:bg-white/20' : 'text-brand-dark hover:bg-gray-100'}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </nav>
      </Container>

      {/* ── Mobile Drawer ──────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in-up">
          <Container>
            <ul className="py-4 flex flex-col gap-1">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`
                        w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-colors
                        ${isActive(item.slug)
                          ? 'text-brand-purple bg-purple-50'
                          : 'text-gray-600 hover:text-brand-dark hover:bg-gray-50'}
                      `}
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <>
                  <li>
                    <button
                      onClick={() => navigate('/add-post')}
                      className="w-full mt-1 px-4 py-3 text-sm font-black bg-brand-purple text-white rounded-xl
                                  hover:bg-purple-700 transition-colors text-left"
                    >
                      ✍️  Write a story
                    </button>
                  </li>
                  <li className="mt-1">
                    <LogoutBtn className="w-full text-left" />
                  </li>
                </>
              )}
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}

export default Header;
