import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/layout/CustomCursor';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { useThemeStore } from './store/themeStore';

// Lazy-loaded sections
const Hero = lazy(() => import('./sections/Hero').then(m => ({ default: m.Hero })));
const About = lazy(() => import('./sections/About').then(m => ({ default: m.About })));
const Experience = lazy(() => import('./sections/Experience').then(m => ({ default: m.Experience })));
const Projects = lazy(() => import('./sections/Projects').then(m => ({ default: m.Projects })));
const PatentShowcase = lazy(() => import('./sections/PatentShowcase').then(m => ({ default: m.PatentShowcase })));
const Gallery = lazy(() => import('./sections/Gallery').then(m => ({ default: m.Gallery })));
const Resume = lazy(() => import('./sections/Resume').then(m => ({ default: m.Resume })));
const Contact = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })));

// Skeleton loader
function SectionSkeleton() {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="skeleton h-10 w-48 mx-auto mb-4" />
      <div className="skeleton h-4 w-96 mx-auto mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Pause Three.js when tab is hidden (handled via Canvas props)
  useEffect(() => {
    const handleVisibility = () => {
      // Canvas automatically pauses via frameloop when hidden
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <>
      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main content */}
      <main>
        <Suspense fallback={null}>
          <Hero />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Experience />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <PatentShowcase />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Gallery />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Resume />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Contact />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Bottom tab bar (mobile) */}
      <BottomTabBar />

      {/* Theme toggle (floating) */}
      <ThemeToggle />

      {/* Toast notifications */}
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: 'white' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'white' },
          },
        }}
      />
    </>
  );
}
