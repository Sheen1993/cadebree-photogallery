import { useState } from 'react';
import { motion } from 'framer-motion';
import { Laugh, Mail, RotateCw, Sparkles } from 'lucide-react';
import { LOVE_NOTES, type LoveNote, type NoteColor } from '../data/galleryData';
import FadeImage from './FadeImage';
import SectionHeading from './SectionHeading';

const PAPER: Record<NoteColor, string> = {
  sky: 'bg-[#DDF2FF]',
  lilac: 'bg-[#EFE3FF]',
  blush: 'bg-love-blush',
  cream: 'bg-love-cream',
};

const faceBase = 'backface-hidden [grid-area:1/1] rounded-sm shadow-paper';

function FlipHint() {
  return (
    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-400 transition-colors group-hover:text-love-lilac-deep">
      <RotateCw className="h-3 w-3" aria-hidden="true" />
      Tap for the fine print
    </span>
  );
}

function NoteFront({ note }: { note: LoveNote }) {
  if (note.kind === 'polaroid') {
    return (
      <div className="h-full bg-white p-3 pb-5">
        <span
          aria-hidden="true"
          className="absolute -top-2 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-love-gradient-deep shadow-md ring-2 ring-white"
        />
        <FadeImage src={note.image} alt={note.imageAlt} className="aspect-square rounded-[2px]" />
        <p className="mt-4 px-1 text-center font-script text-2xl leading-snug text-slate-700">{note.message}</p>
        <div className="text-center">
          <FlipHint />
        </div>
      </div>
    );
  }

  return (
    <div className={`${PAPER[note.color]} flex h-full min-h-[15rem] flex-col p-6 pt-8`}>
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 bg-white/60 shadow-sm backdrop-blur-sm"
      />
      <p className="flex-1 font-script text-[1.7rem] leading-snug text-slate-700">{note.message}</p>
      <p className="mt-4 text-right font-script text-xl text-love-lilac-deep">&mdash; {note.signature}</p>
      <FlipHint />
    </div>
  );
}

function NoteBack({ note, hidden }: { note: LoveNote; hidden: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className={`${faceBase} flex flex-col items-center justify-center bg-white bg-[linear-gradient(transparent_31px,#DFC5FE55_32px)] bg-[length:100%_32px] p-6 text-center [transform:rotateY(180deg)]`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-love-gradient shadow-glow">
        <Sparkles className="h-5 w-5 text-slate-800" aria-hidden="true" />
      </span>
      <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-love-sky-deep">The fine print</p>
      <p className="mt-3 font-display text-lg italic leading-relaxed text-slate-700">{note.punchline}</p>
      <Laugh className="mt-4 h-5 w-5 text-love-lilac-deep motion-safe:animate-bounce" aria-hidden="true" />
    </div>
  );
}

function NoteCard({ note, index }: { note: LoveNote; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.li
      className="w-full list-none sm:w-[calc(50%-1.25rem)] lg:w-[calc(25%-1.5rem)]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        className="perspective-1000 group block w-full text-left"
        initial={false}
        animate={{ rotate: note.rotation }}
        whileHover={{ rotate: 0, y: -10, scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <span className="sr-only">{flipped ? 'Show the note' : 'Flip to read the fine print'}</span>
        <motion.div
          className="preserve-3d relative grid"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={`${faceBase} relative transition-shadow duration-500 group-hover:shadow-glow`} aria-hidden={flipped}>
            <NoteFront note={note} />
          </div>
          <NoteBack note={note} hidden={!flipped} />
        </motion.div>
      </motion.button>
    </motion.li>
  );
}

export default function LoveNotes() {
  return (
    <section id="notes" aria-labelledby="notes-title" className="relative px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        id="notes-title"
        icon={Mail}
        eyebrow="Love Notes"
        title="Notes From My Heart"
        subtitle="Little truths about us: a few sweet, most of them very silly. Tap any note for the fine print."
      />

      <div className="glass-card relative mx-auto max-w-6xl rounded-[2.5rem] bg-[radial-gradient(#DFC5FE_1.2px,transparent_1.2px)] bg-[length:22px_22px] px-5 py-12 sm:px-10 sm:py-16">
        <ul className="flex flex-wrap items-start justify-center gap-10 lg:gap-8">
          {LOVE_NOTES.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
