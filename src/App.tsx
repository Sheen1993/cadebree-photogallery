import { MotionConfig } from 'framer-motion';
import BackgroundMusic from './components/BackgroundMusic';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import Hero from './components/Hero';
import LoveNotes from './components/LoveNotes';
import Timeline from './components/Timeline';

export default function App() {
  return (
    // "user" makes every Framer Motion animation honour the OS reduced-motion setting.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-gradient-to-br from-slate-50 via-love-sky/10 to-love-lilac/15">
        <main>
          <Hero />
          <Timeline />
          <Gallery />
          <LoveNotes />
        </main>
        <Footer />
        <BackgroundMusic />
      </div>
    </MotionConfig>
  );
}
