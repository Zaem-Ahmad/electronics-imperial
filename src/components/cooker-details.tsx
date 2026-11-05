"use client";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "./icon";

const details = [
  {
    title: "A surface with presence.",
    label: "CERAMIC GLASS",
    text: "A clean, ceramic glass surface at the heart of your kitchen setup. Handle it with care: physical damage to the glass is excluded from the warranty.",
    position: "surface",
  },
  {
    title: "A more hands-on approach.",
    label: "CONTROL KNOB",
    text: "A front-facing control knob keeps the controls close at hand. Eligible manufacturing and technical faults with the knob are covered by the 1-year warranty.",
    position: "knob",
  },
  {
    title: "Considered, down to the handles.",
    label: "STAINLESS STEEL HANDLES",
    text: "A stainless steel handle on each side completes the compact design. Always let your cooker cool before moving or handling it.",
    position: "handles",
  },
];

export function CookerDetails() {
  const [selected, setSelected] = useState(0);
  return (
    <section className="details-section" aria-labelledby="details-heading">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">LOOK A LITTLE CLOSER</p>
            <h2 id="details-heading">
              It’s all in
              <br />
              <span>the everyday details.</span>
            </h2>
          </div>
          <p className="section-aside">
            Nothing to overthink.
            <br />
            Plenty to appreciate.
          </p>
        </div>
        <div className="details-grid">
          <div className="detail-showcase reveal">
            <Image
              src="/images/ecc_3.png"
              alt="Ceramic cooker showing its glass surface, front control knob, and side handles"
              width={1024}
              height={1024}
              sizes="(max-width: 800px) 90vw, 50vw"
            />
            {details.map((detail, index) => (
              <button
                key={detail.position}
                className={`hotspot hotspot-${detail.position}`}
                type="button"
                aria-label={`Explore ${detail.label.toLowerCase()}`}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <span>0{index + 1}</span>
              </button>
            ))}
            <p className="hotspot-hint">
              Tap a detail. Get to know your cooker.
            </p>
          </div>
          <div className="detail-accordion reveal">
            {details.map((detail, index) => (
              <div
                className={`detail-item ${selected === index ? "active" : ""}`}
                key={detail.label}
              >
                <button
                  type="button"
                  aria-expanded={selected === index}
                  aria-controls={`cooker-detail-${index}`}
                  onClick={() => setSelected(index)}
                >
                  <span className="detail-index">0{index + 1}</span>
                  <span>
                    <small>{detail.label}</small>
                    <strong>{detail.title}</strong>
                  </span>
                  <Icon name="plus" />
                </button>
                <div id={`cooker-detail-${index}`} hidden={selected !== index}>
                  <p>{detail.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
