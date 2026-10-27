import type { CSSProperties } from 'react';
import { Heart } from 'lucide-react';

type ParticleShape = 'heart' | 'petal';

interface Particle {
  id: number;
  shape: ParticleShape;
  left: number;
  size: number;
  duration: number;
  delay: number;
  swayDuration: number;
  color: string;
}

const COLORS = ['#90D5FF', '#DFC5FE', '#F9C6DA', '#C4B5FD', '#B9E6FF'];
const PARTICLE_COUNT = 22;

/** Small deterministic PRNG so the layout is stable between renders. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PARTICLES: readonly Particle[] = (() => {
  const rand = mulberry32(1227);
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const duration = 14 + rand() * 14;
    return {
      id,
      shape: rand() > 0.45 ? 'heart' : 'petal',
      left: rand() * 100,
      size: 12 + rand() * 22,
      duration,
      // Negative delays start each particle mid-flight, so the sky is never empty on load.
      delay: -rand() * duration,
      swayDuration: 3 + rand() * 3,
      color: COLORS[Math.floor(rand() * COLORS.length)] ?? '#DFC5FE',
    };
  });
})();

export default function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {PARTICLES.map((p) => {
        const travel: CSSProperties = { animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` };
        const sway: CSSProperties = { animationDuration: `${p.swayDuration}s`, left: `${p.left}%` };
        return (
          <div key={p.id} className="absolute inset-0 animate-float-up will-change-transform" style={travel}>
            <div className="absolute top-0 animate-sway" style={sway}>
              {p.shape === 'heart' ? (
                <Heart
                  style={{ width: p.size, height: p.size, color: p.color, fill: p.color }}
                  className="drop-shadow-[0_4px_10px_rgba(144,213,255,0.5)]"
                />
              ) : (
                <span
                  className="block rounded-[100%_0] opacity-80"
                  style={{
                    width: p.size * 0.8,
                    height: p.size * 0.8,
                    background: `linear-gradient(135deg, ${p.color}, #ffffff)`,
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
