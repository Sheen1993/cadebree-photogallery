import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowDown, CalendarHeart, Heart, Infinity as InfinityIcon } from 'lucide-react';
import { COUPLE } from '../data/galleryData';
import AnniversaryCounter from './AnniversaryCounter';
import FloatingHearts from './FloatingHearts';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

function scrollToSection(id: string, smooth: boolean) {
  document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [yearsWord, ...restOfTitle] = COUPLE.title.split(' of ');

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-20 sm:px-6"
    >
      {/* Ambient colour blobs */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-32 top-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full bg-love-sky/40 blur-3xl sm:h-[36rem] sm:w-[36rem]"
        animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -right-32 bottom-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-love-lilac/50 blur-3xl sm:h-[38rem] sm:w-[38rem]"
        animate={reduceMotion ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_65%)]"
      />

      <FloatingHearts />

      <motion.div
        className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={rise}
          className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600"
        >
          <CalendarHeart className="h-4 w-4 text-love-lilac-deep" aria-hidden="true" />
          Dec 27, 2024
          <InfinityIcon className="h-4 w-4 text-love-sky-deep" aria-hidden="true" />
          Forever
        </motion.span>

        <motion.p variants={rise} className="mt-8 font-script text-3xl text-love-lilac-deep sm:text-4xl">
          {COUPLE.tagline}
        </motion.p>

        <motion.h1
          id="hero-title"
          variants={rise}
          className="mt-2 font-display text-6xl font-bold leading-[1.05] tracking-tight text-slate-800 sm:text-7xl md:text-8xl"
        >
          <span className="text-gradient">{yearsWord}</span>
          {restOfTitle.length > 0 && (
            <>
              {' '}
              <span className="italic">of {restOfTitle.join(' of ')}</span>
            </>
          )}
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-6 flex max-w-3xl flex-col items-center gap-2 text-base text-slate-600 sm:flex-row sm:gap-3 sm:text-lg"
        >
          <span>{COUPLE.subtitle}</span>
          <Heart className="hidden h-3.5 w-3.5 fill-love-lilac text-love-lilac-deep sm:block" aria-hidden="true" />
          <span className="whitespace-nowrap font-medium text-slate-700">{COUPLE.weddingDateLabel}</span>
        </motion.p>

        <motion.div variants={rise} className="mt-10 w-full">
          <AnniversaryCounter />
        </motion.div>

        <motion.div variants={rise} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <motion.button
            type="button"
            onClick={() => scrollToSection('gallery', !reduceMotion)}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            initial="rest"
            animate="rest"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-love-gradient px-8 py-4 font-medium text-slate-800 shadow-glow transition-shadow duration-300 hover:shadow-glow-lg"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <motion.span
              variants={{ rest: { scale: 1 }, hover: { scale: [1, 1.3, 1, 1.2, 1], transition: { duration: 0.9 } } }}
              className="relative"
            >
              <Heart className="h-5 w-5 fill-white text-white" aria-hidden="true" />
            </motion.span>
            <span className="relative">Scroll to Gallery</span>
            <motion.span
              variants={{ rest: { y: 0 }, hover: { y: [0, 4, 0], transition: { duration: 0.8, repeat: Infinity } } }}
              className="relative"
            >
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          </motion.button>

          <button
            type="button"
            onClick={() => scrollToSection('story', !reduceMotion)}
            className="rounded-full px-5 py-3 text-sm font-medium text-slate-600 underline decoration-love-lilac decoration-2 underline-offset-8 transition-colors hover:text-love-lilac-deep"
          >
            Read our story
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
