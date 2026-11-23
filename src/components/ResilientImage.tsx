import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'h-full w-full object-contain',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#f3eff7] p-4 text-center text-[#4c1d95]"
      >
        <ImageOff className="h-7 w-7 opacity-75" aria-hidden="true" />
        <span className="text-sm font-bold">{fallbackTitle ?? alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
