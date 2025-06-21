import React from "react";

interface ImageDisplayProps {
  imageUrl?: string | null;
  alt?: string;
}

export function ImageDisplay({
  imageUrl,
  alt = "Adventure scene",
}: ImageDisplayProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white border-opacity-20 shadow-lg overflow-hidden">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-auto object-cover"
        width={512}
        height={512}
      />
    </div>
  );
}
