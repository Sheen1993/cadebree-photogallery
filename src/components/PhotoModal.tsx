import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, type PanInfo, type Variants } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Quote, X } from 'lucide-react';
import { ALBUMS, type Album, type Photo } from '../data/galleryData';
import { formatDate } from '../utils/date';
import FadeImage from './FadeImage';

export type SlideDirection = 1 | -1;

interface PhotoModalProps {
  photos: readonly Photo[];
  index: number;
  direction: SlideDirection;
  onClose: () => void;
  onNavigate: (step: SlideDirection) => void;
}

const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;

const slide: Variants = {
  enter: (direction: SlideDirection) => ({ x: direction * 120, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: (direction: SlideDirection) => ({
    x: direction * -120,
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

function albumFor(photo: Photo): Album | undefined {
  return ALBUMS.find((album) => album.id === photo.album);
}

/** Locks page scroll while mounted, compensating for the scrollbar so nothing jumps. */
function useScrollLock() {
  useEffect(() => {
    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
    };
  }, []);
}

export default function PhotoModal({ photos, index, direction, onClose, onNavigate }: PhotoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];
  const hasMultiple = photos.length > 1;

  useScrollLock();

  // Focus the dialog on open and hand focus back to whatever opened it on close.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => opener?.focus();
  }, []);

  // Keyboard shortcuts plus a simple focus trap.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowRight' && hasMultiple) {
        event.preventDefault();
        onNavigate(1);
      } else if (event.key === 'ArrowLeft' && hasMultiple) {
        event.preventDefault();
        onNavigate(-1);
      } else if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate, hasMultiple]);

  // Warm the cache for the neighbouring photos so browsing feels instant.
  useEffect(() => {
    if (!hasMultiple) return;
    [index + 1, index - 1].forEach((i) => {
      const neighbour = photos[(i + photos.length) % photos.length];
      if (neighbour) new Image().src = neighbour.src;
    });
  }, [index, photos, hasMultiple]);

  if (!photo) return null;
  const album = albumFor(photo);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!hasMultiple) return;
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onNavigate(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onNavigate(-1);
  };

  const navButton =
    'flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-glow';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-[#2b3a55]/45 to-[#4b3470]/50 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-modal-title"
        className="glass-card relative grid max-h-[94svh] w-full max-w-6xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-3xl lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:grid-rows-1"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: 0, y: 30, scale: 0.96, transition: { duration: 0.25 } }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className={`${navButton} absolute right-3 top-3 z-20 hover:rotate-90`}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Photo */}
        <div className="relative h-[46svh] overflow-hidden bg-slate-900/10 sm:h-[55svh] lg:h-[86svh]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={photo.id}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              drag={hasMultiple ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <img
                src={photo.thumbnail}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
              />
              <FadeImage
                src={photo.src}
                alt={photo.alt}
                fit="contain"
                loading="eager"
                draggable={false}
                className="relative h-full w-full"
              />
            </motion.div>
          </AnimatePresence>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                aria-label="Previous photo"
                className={`${navButton} absolute left-3 top-1/2 z-10 -translate-y-1/2`}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(1)}
                aria-label="Next photo"
                className={`${navButton} absolute right-3 top-1/2 z-10 -translate-y-1/2`}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Details */}
        <div className="flex min-h-0 flex-col overflow-y-auto p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              className="flex-1"
            >
              <span className="inline-flex rounded-full bg-love-gradient px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-800">
                {album?.label ?? photo.album}
              </span>
              <h2 id="photo-modal-title" className="mt-4 pr-10 font-display text-3xl font-bold text-slate-800 lg:pr-0">
                {photo.title}
              </h2>
              <dl className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Date</dt>
                  <Calendar className="h-4 w-4 text-love-sky-deep" aria-hidden="true" />
                  <dd>
                    <time dateTime={photo.date}>{formatDate(photo.date)}</time>
                  </dd>
                </div>
                {photo.location && (
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Location</dt>
                    <MapPin className="h-4 w-4 text-love-lilac-deep" aria-hidden="true" />
                    <dd>{photo.location}</dd>
                  </div>
                )}
              </dl>

              <figure className="relative mt-6 rounded-2xl border border-white/60 bg-gradient-to-br from-love-sky/20 to-love-lilac/30 p-5">
                <Quote className="absolute -top-3 left-4 h-7 w-7 rounded-full bg-white p-1.5 text-love-lilac-deep shadow-md" aria-hidden="true" />
                <blockquote className="font-display text-lg italic leading-relaxed text-slate-700">{photo.memory ?? album?.story}</blockquote>
                <figcaption className="mt-3 font-script text-xl text-love-lilac-deep">{photo.caption}</figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between border-t border-white/60 pt-5">
            <p className="text-sm font-medium tabular-nums text-slate-500" aria-live="polite">
              {index + 1} <span className="text-slate-400">/</span> {photos.length}
            </p>
            <p className="hidden text-xs text-slate-400 [@media(hover:hover)]:block">
              <kbd className="rounded border border-slate-300 bg-white/80 px-1.5 py-0.5 font-sans">&larr;</kbd>{' '}
              <kbd className="rounded border border-slate-300 bg-white/80 px-1.5 py-0.5 font-sans">&rarr;</kbd> browse
              &middot; <kbd className="rounded border border-slate-300 bg-white/80 px-1.5 py-0.5 font-sans">Esc</kbd> close
            </p>
            <p className="text-xs text-slate-400 [@media(hover:hover)]:hidden">Swipe to browse</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
