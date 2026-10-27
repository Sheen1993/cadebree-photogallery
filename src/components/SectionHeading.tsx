import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle?: string;
  id?: string;
}

export default function SectionHeading({ icon: Icon, eyebrow, title, subtitle, id }: SectionHeadingProps) {
  return (
    <motion.header
      className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-love-lilac-deep shadow-md">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 id={id} className="mt-5 font-display text-4xl font-bold text-slate-800 sm:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{subtitle}</p>}
    </motion.header>
  );
}
