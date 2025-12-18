import { GlobeLock, Sparkles, Menu, X, BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import LookupPanel from './components/LookupPanel';
import AuthPanel from './components/AuthPanel';
import FeatureGrid from './components/FeatureGrid';
import AdminDashboard from './components/AdminDashboard';
import PlatformSection from './components/PlatformSection';
import FeaturesSection from './components/FeaturesSection';
import SecuritySection from './components/SecuritySection';
import ContactSection from './components/ContactSection';
import DashboardSection from './components/DashboardSection';
import StudentsPage from './components/StudentsPage';
import { scrollToSection } from './utils/scrollToSection';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleNavClick = (_path: string, id?: string) => {
    if (id) {
      // For hash routes, scroll to section
      scrollToSection(id);
    }
  };

  const navItems = [
    { name: 'Platform', path: '/#platform', id: 'platform' },
    { name: 'Features', path: '/#features', id: 'features' },
    { name: 'Security', path: '/#security', id: 'security' },
    { name: 'Contact', path: '/#contact', id: 'contact' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-[#050a1f] text-white">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-[#050a1f] focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur" role="banner">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow transition-transform group-hover:scale-105">
                <BadgeCheck className="h-8 w-8" />
              </div>
              <div className="flex flex-col">
                <p className="font-display text-lg group-hover:text-teal-200 transition-colors">Certificate Verification System</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">Modern SaaS for academic trust</p>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden ml-auto p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
          <nav
            className="hidden md:flex flex-wrap justify-end gap-2 text-sm text-slate-300"
            role="navigation"
            aria-label="Main"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => handleNavClick(item.path, item.id)}
                className="rounded-full border border-transparent px-4 py-2 transition hover:border-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-current={location.pathname + location.hash === item.path ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <nav
              className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur z-10"
              role="navigation"
              aria-label="Main"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => handleNavClick(item.path, item.id)}
                    className="rounded-lg px-4 py-3 text-left transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-current={location.pathname + location.hash === item.path ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </header>

        <main id="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />

                <section className="mt-10 grid gap-6 lg:grid-cols-2">
                  <LookupPanel />
                  <AuthPanel />
                </section>

                <section className="mt-10 rounded-[34px] border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white">
                      <GlobeLock className="h-6 w-6" />
                    </div>
                    <div className="max-w-2xl">
                      <p className="text-sm uppercase tracking-wide text-slate-400">Security & Compliance</p>
                      <h3 className="text-2xl font-semibold text-white">SOC2-ready, GDPR-first infrastructure</h3>
                      <p className="mt-2 text-sm text-slate-300">
                        We encrypt data at rest, monitor login attempts, and log every action so your verification program remains
                        compliant with modern privacy regulations.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
                      <p className="flex items-center gap-2 text-white">
                        <Sparkles className="h-4 w-4 text-teal-200" /> AI-assisted anomaly detection
                      </p>
                      <p className="text-xs text-slate-400">Powered by audit trails and risk scoring</p>
                    </div>
                  </div>
                </section>

                <div className="mt-14 space-y-12">
                  <FeatureGrid />
                  <AdminDashboard />
                </div>

                <PlatformSection />
                <FeaturesSection />
                <SecuritySection />
                <ContactSection />
              </>
            } />
            <Route path="/dashboard" element={<DashboardSection />} />
            <Route path="/admin/students" element={<StudentsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;


