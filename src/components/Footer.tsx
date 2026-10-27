import { motion } from 'framer-motion';
import { ArrowUp, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative px-4 pb-10 pt-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] px-6 py-12 text-center"
      >
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-love-lilac/40 motion-reduce:hidden" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-love-gradient shadow-glow">
            <Heart className="h-7 w-7 animate-pulse fill-white text-white" aria-hidden="true" />
          </span>
        </div>

        <p className="mt-6 font-display text-2xl italic text-slate-700 sm:text-3xl">
          Crafted with love for my wonderful wife.
        </p>
        <p className="mt-3 font-script text-2xl text-love-lilac-deep">Here&rsquo;s to forever, together.</p>

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-love-sky" />
          Dec 27, 2024 &ndash; Always
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-love-lilac" />
        </div>

        <a
          href="#top"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:text-love-lilac-deep hover:shadow-glow"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
          Back to the beginning
        </a>
      </motion.div>

      <p className="mt-8 text-center text-xs text-slate-400">&copy; {year} &middot; Our little corner of the internet</p>
    </footer>
  );
}
