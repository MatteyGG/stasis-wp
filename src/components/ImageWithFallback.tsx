// components/ImageWithFallback.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}

export default function ImageWithFallback({ 
  src, 
  fallbackSrc, 
  alt, 
  className = "", 
  width, 
  height 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}