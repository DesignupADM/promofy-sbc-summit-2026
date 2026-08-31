"use client";

import { useState } from "react";

type BrandImgProps = {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  className?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync";
  fetchPriority?: "high" | "low" | "auto";
  fallbackText?: string;
};

export default function BrandImg({
  src,
  alt,
  height,
  width,
  className,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  fallbackText,
}: BrandImgProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    if (fallbackText) {
      return (
        <span className={className} role="img" aria-label={alt}>
          {fallbackText}
        </span>
      );
    }
    return <span className={className} aria-hidden="true" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      onError={() => setFailed(true)}
    />
  );
}
