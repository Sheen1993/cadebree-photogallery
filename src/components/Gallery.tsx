import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Camera, Heart, Images, MapPin, Maximize2 } from 'lucide-react';
import { ALBUMS, GALLERY_FILTERS, PHOTOS, type GalleryFilter, type Photo } from '../data/galleryData';
import { formatDate } from '../utils/date';
import FadeImage from './FadeImage';
import PhotoModal, { type SlideDirection } from './PhotoModal';
import SectionHeading from './SectionHeading';

interface LightboxState {
  index: number;
  direction: SlideDirection;
}

function countByFilter(photos: readonly Photo[]): Record<GalleryFilter, number> {
  const counts = Object.fromEntries(ALBUMS.map((album) => [album.id, 0])) as Record<GalleryFilter, number>;
  counts.all = photos.length;
  photos.forEach((photo) => {
    counts[photo.album] += 1;
  });
  return counts;
}

function FilterBar({
  active,
  counts,
  onChange,
}: {
  active: GalleryFilter;
  counts: Record<GalleryFilter, number>;
  onChange: (filter: GalleryFilter) => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 mb-4 overflow-x-auto px-4 pb-6 pt-2 sm:mx-0 sm:px-0">
      <div
        role="group"
        aria-label="Filter photos by category"
        className="glass-card mx-auto flex w-max gap-1 rounded-full p-1.5 sm:flex-wrap sm:justify-center"
      >
        {GALLERY_FILTERS.map((filter) => {
          const isActive = filter.id === active;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(filter.id)}
              className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-filter"
                  className="absolute inset-0 rounded-full bg-love-gradient shadow-glow"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {filter.label}
                <span
                  className={`rounded-full px-1.5 text-[0.7rem] tabular-nums ${
                    isActive ? 'bg-white/70 text-slate-700' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {counts[filter.id]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhotoCard({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: () => void }) {
  return (
    <motion.div
      className="mb-5 break-inside-avoid"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open “${photo.title}”`}
        className="glass-card gradient-border group block w-full rounded-3xl p-2 text-left transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-glow-lg"
      >
        <div className="relative overflow-hidden rounded-2xl">
          <FadeImage
            src={photo.thumbnail}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />

          <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-white/80 text-slate-700 opacity-0 shadow-md backdrop-blur transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </span>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 p-4 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 sm:p-5">
            <h3 className="font-display text-xl font-bold leading-tight drop-shadow">{photo.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-white/90">{photo.caption}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-love-sky" aria-hidden="true" />
                {formatDate(photo.date, 'short')}
              </span>
              {photo.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-love-lilac" aria-hidden="true" />
                  {photo.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const counts = useMemo(() => countByFilter(PHOTOS), []);
  const photos = useMemo(
    () => (filter === 'all' ? PHOTOS : PHOTOS.filter((photo) => photo.album === filter)),
    [filter],
  );

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const navigate = useCallback(
    (step: SlideDirection) =>
      setLightbox((current) =>
        current ? { index: (current.index + step + photos.length) % photos.length, direction: step } : current,
      ),
    [photos.length],
  );

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative isolate scroll-mt-4 px-4 py-24 sm:px-6 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 mx-auto h-[40rem] max-w-5xl rounded-full bg-gradient-to-r from-love-sky/20 via-love-lilac/25 to-love-sky/20 blur-3xl"
      />

      <SectionHeading
        id="gallery-title"
        icon={Camera}
        eyebrow="Our Gallery"
        title="Moments We Treasure"
        subtitle="Every picture tells a little piece of our story. Tap any photo to relive the memory behind it."
      />

      <div className="mx-auto max-w-7xl">
        <FilterBar active={filter} counts={counts} onChange={setFilter} />

        <p className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-500" aria-live="polite">
          <Images className="h-4 w-4 text-love-sky-deep" aria-hidden="true" />
          Showing {photos.length} {photos.length === 1 ? 'memory' : 'memories'}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {photos.length > 0 ? (
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {photos.map((photo, index) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    index={index}
                    onOpen={() => setLightbox({ index, direction: 1 })}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card mx-auto flex max-w-md flex-col items-center rounded-3xl p-10 text-center">
                <Heart className="h-8 w-8 fill-love-lilac text-love-lilac-deep" aria-hidden="true" />
                <p className="mt-4 font-display text-xl text-slate-700">More memories coming soon&hellip;</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {createPortal(
        <AnimatePresence>
          {lightbox && (
            <PhotoModal
              key="photo-modal"
              photos={photos}
              index={lightbox.index}
              direction={lightbox.direction}
              onClose={closeLightbox}
              onNavigate={navigate}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
