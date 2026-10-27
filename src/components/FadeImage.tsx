import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

interface FadeImageProps {
  src: string;
  alt: string;
  /** Classes for the wrapper; give it a size or aspect ratio. */
  className?: string;
  /** Classes for the <img> itself, e.g. hover transforms. */
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  draggable?: boolean;
  fit?: 'cover' | 'contain';
  /** Intrinsic pixel size; when given, the wrapper keeps the image's aspect ratio. */
  width?: number;
  height?: number;
}

type LoadState = 'loading' | 'loaded' | 'error';

/** Image with a shimmering placeholder, a soft fade-in and a graceful fallback. */
export default function FadeImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  loading = 'lazy',
  sizes,
  draggable,
  fit = 'cover',
  width,
  height,
}: FadeImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    const img = imgRef.current;
    // Cached images can finish before React attaches the load handler.
    if (!img?.complete) setState('loading');
    else setState(img.naturalWidth > 0 ? 'loaded' : 'error');
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      {state !== 'loaded' && (
        <div className="shimmer-bg absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {state === 'error' && <Heart className="h-10 w-10 fill-love-lilac text-love-lilac-deep/60" />}
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        sizes={sizes}
        width={width}
        height={height}
        draggable={draggable}
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-700 ${
          state === 'loaded' ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
}
