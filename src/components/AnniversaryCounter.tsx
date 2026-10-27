import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { WEDDING_DATE } from '../data/galleryData';
import { getTimeTogether, type TimeTogether } from '../utils/date';

type CounterUnit = keyof TimeTogether;

const UNITS: readonly { key: CounterUnit; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

function useTimeTogether(since: Date): TimeTogether {
  const [time, setTime] = useState(() => getTimeTogether(since));

  useEffect(() => {
    const id = window.setInterval(() => setTime(getTimeTogether(since)), 1000);
    return () => window.clearInterval(id);
  }, [since]);

  return time;
}

/** Counts up from zero on first view, then glides to each new value. */
function CountUp({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => Math.round(v).toLocaleString('en-US'));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: reduceMotion ? 0 : 2.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [motionValue, value, reduceMotion]);

  return <motion.span className="text-gradient">{display}</motion.span>;
}

/** Rolls each new value in from below, like a flip clock. */
function RollingNumber({ value }: { value: number }) {
  const padded = value.toString().padStart(2, '0');
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={padded}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-gradient inline-block"
        >
          {padded}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function AnniversaryCounter() {
  const time = useTimeTogether(WEDDING_DATE);

  return (
    <div className="w-full" role="timer" aria-label="Time together since our wedding day">
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
        Together for
      </p>
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {UNITS.map(({ key, label }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="glass-card gradient-border rounded-2xl px-3 py-4 text-center transition-shadow duration-300 hover:shadow-glow sm:py-5"
          >
            <div className="font-display text-3xl font-bold tabular-nums sm:text-4xl">
              {key === 'days' ? <CountUp value={time.days} /> : <RollingNumber value={time[key]} />}
            </div>
            <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-slate-500">{label}</div>
          </motion.div>
        ))}
      </div>
      <p className="sr-only" aria-live="off">
        {time.days} days, {time.hours} hours and {time.minutes} minutes since December 27, 2024.
      </p>
    </div>
  );
}
