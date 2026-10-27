import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { OUR_SONG } from '../data/galleryData';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * - loading: the YouTube player is still starting up
 * - waiting: the browser blocked autoplay; the song starts on the first click, tap or key press
 * - unavailable: the video could not be loaded (offline, removed, embedding disabled)
 */
type MusicStatus = 'loading' | 'waiting' | 'playing' | 'paused' | 'unavailable';

const PAUSED_KEY = 'our-song-paused';
const AUTOPLAY_CHECK_MS = 1500;
const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchend'] as const;

let apiPromise: Promise<void> | null = null;

/** Loads the YouTube IFrame Player API once, however many times it is requested. */
function loadYouTubeApi(): Promise<void> {
  if (typeof YT !== 'undefined' && typeof YT.Player === 'function') return Promise.resolve();
  apiPromise ??= new Promise<void>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error('Could not load the YouTube player'));
    };
    document.head.append(script);
  });
  return apiPromise;
}

// A visitor who paused the song keeps it paused on their next visit.
function readPausedPreference(): boolean {
  try {
    return localStorage.getItem(PAUSED_KEY) === '1';
  } catch {
    return false;
  }
}

function writePausedPreference(paused: boolean) {
  try {
    if (paused) localStorage.setItem(PAUSED_KEY, '1');
    else localStorage.removeItem(PAUSED_KEY);
  } catch {
    // Storage unavailable (private mode, blocked site data): the preference just isn't remembered.
  }
}

function EqualizerBars() {
  return (
    <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
      {[0, 0.25, 0.5, 0.15].map((delay) => (
        <span
          key={delay}
          className="h-full w-[3px] origin-bottom animate-equalizer rounded-full bg-love-gradient-deep motion-reduce:animate-none"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}

/** Plays "our song" from a hidden YouTube player, looping, with a small floating play/pause control. */
export default function BackgroundMusic() {
  const hostRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const wantsMusicRef = useRef(!readPausedPreference());
  const [status, setStatus] = useState<MusicStatus>('loading');
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let autoplayCheck: number | undefined;
    // YouTube swaps this element for its iframe, so React must not own it.
    const mount = document.createElement('div');
    host.append(mount);

    const play = () => {
      const player = playerRef.current;
      if (!player) return;
      player.unMute();
      player.playVideo();
    };

    const removeInteractionListeners = () =>
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, startOnInteraction));

    function startOnInteraction(event: Event) {
      // The music button handles its own clicks; starting here as well would immediately undo them.
      if (event.target instanceof Node && buttonRef.current?.contains(event.target)) return;
      removeInteractionListeners();
      if (wantsMusicRef.current) play();
    }

    loadYouTubeApi()
      .then(() => {
        if (cancelled) return;
        playerRef.current = new YT.Player(mount, {
          width: 200,
          height: 200,
          videoId: OUR_SONG.youtubeId,
          // Plain numbers: these enums exist only in the type definitions, not on the runtime YT object.
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            // Looping a single video requires the video to also be its own playlist.
            loop: 1,
            playlist: OUR_SONG.youtubeId,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: ({ target }) => {
              if (cancelled) return;
              target.setVolume(OUR_SONG.volume);
              if (!wantsMusicRef.current) {
                setStatus('paused');
                return;
              }
              play();
              // Browsers silently refuse sound before the visitor interacts with the page.
              autoplayCheck = window.setTimeout(() => {
                if (cancelled || target.getPlayerState() === YT.PlayerState.PLAYING) return;
                setStatus('waiting');
                INTERACTION_EVENTS.forEach((type) =>
                  window.addEventListener(type, startOnInteraction, { passive: true }),
                );
              }, AUTOPLAY_CHECK_MS);
            },
            onStateChange: ({ data, target }) => {
              if (cancelled) return;
              if (data === YT.PlayerState.PLAYING) {
                removeInteractionListeners();
                setStatus('playing');
              } else if (data === YT.PlayerState.PAUSED) {
                setStatus('paused');
              } else if (data === YT.PlayerState.ENDED) {
                // Backup for the playlist loop above.
                target.seekTo(0, true);
                target.playVideo();
              }
            },
            onError: () => {
              if (!cancelled) setStatus('unavailable');
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable');
      });

    return () => {
      cancelled = true;
      window.clearTimeout(autoplayCheck);
      removeInteractionListeners();
      playerRef.current?.destroy();
      playerRef.current = null;
      host.replaceChildren();
    };
  }, []);

  const isPlaying = status === 'playing';

  const toggle = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      wantsMusicRef.current = false;
      writePausedPreference(true);
      player.pauseVideo();
    } else {
      wantsMusicRef.current = true;
      writePausedPreference(false);
      player.unMute();
      player.playVideo();
    }
  };

  const label =
    status === 'waiting'
      ? 'Tap anywhere to play our song'
      : `${OUR_SONG.title} · ${OUR_SONG.artist}`;

  return (
    <>
      {/* The player has to exist to make sound, but nobody needs to see it. */}
      <div
        ref={hostRef}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 -z-50 h-[200px] w-[200px] overflow-hidden opacity-0"
      />

      {status !== 'unavailable' && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 sm:bottom-6 sm:right-6">
          <AnimatePresence>
            {(showLabel || status === 'waiting') && (
              <motion.span
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="glass-card pointer-events-none whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium text-slate-600 shadow-glow"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button
            ref={buttonRef}
            type="button"
            onClick={toggle}
            onMouseEnter={() => setShowLabel(true)}
            onMouseLeave={() => setShowLabel(false)}
            onFocus={() => setShowLabel(true)}
            onBlur={() => setShowLabel(false)}
            disabled={status === 'loading'}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? `Pause ${OUR_SONG.title}` : `Play ${OUR_SONG.title}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="glass-card gradient-border relative flex h-12 w-12 items-center justify-center rounded-full shadow-glow transition-opacity disabled:opacity-60 sm:h-14 sm:w-14"
          >
            {status === 'waiting' && (
              <span className="absolute inset-0 animate-ping rounded-full bg-love-lilac/40 motion-reduce:hidden" />
            )}
            {isPlaying ? <EqualizerBars /> : <Music className="h-5 w-5 text-love-lilac-deep" aria-hidden="true" />}
          </motion.button>
        </div>
      )}
    </>
  );
}
