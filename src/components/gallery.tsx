"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="gallery">
      <div className="gallery-main">
        <Image
          src={images[selected]}
          alt={`${title} — view ${selected + 1}`}
          width={1024}
          height={1024}
          sizes="(max-width: 800px) 92vw, 48vw"
          preload
        />
      </div>
      <div className="gallery-thumbnails" aria-label="Product photos">
        {images.map((src, index) => (
          <button
            type="button"
            key={src}
            aria-label={`View product photo ${index + 1}`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <Image src={src} alt="" width={112} height={112} sizes="100px" />
          </button>
        ))}
      </div>
      <p className="gallery-caption">A closer look, from every angle.</p>
    </div>
  );
}
