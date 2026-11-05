"use client";
import Image from "next/image";
import { useId, useState } from "react";
import Link from "next/link";
import { Icon } from "./icon";

const moments = [
  {
    label: "The slow start",
    time: "08:00",
    title: "Make time for\nthe first cup.",
    description:
      "Before the notifications. Before the to-do list. A little space to start the day your way.",
    image: "/images/ecc_2.png",
    alt: "Top view of the electric ceramic cooker",
  },
  {
    label: "The midday pause",
    time: "13:00",
    title: "Good food.\nA fresh start.",
    description:
      "Step away from the busy. Make something for yourself. Turn a lunch break into a moment worth taking.",
    image: "/images/ecc_1.png",
    alt: "Electric ceramic cooker with a pan of food",
  },
  {
    label: "The evening ritual",
    time: "20:00",
    title: "Come home\nto something warm.",
    description:
      "The day can wait a little. Bring your favorite ingredients, put something on, and settle into the evening.",
    image: "/images/ecc_3.png",
    alt: "Electric ceramic cooker with its glowing heating surface",
  },
];

export function CookingMoments() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const current = moments[selected];
  return (
    <section
      className="moments-section container section"
      aria-labelledby="moments-heading"
    >
      <div className="section-heading reveal">
        <div>
          <p className="eyebrow">THERE’S A MOMENT FOR EVERYTHING</p>
          <h2 id="moments-heading">
            From first light
            <br />
            to the last bite.
          </h2>
        </div>
        <p className="section-aside">
          Same cooker. Different moments.
          <br />A whole day of possibilities.
        </p>
      </div>
      <div
        className="moment-tabs reveal"
        role="tablist"
        aria-label="Everyday cooking moments"
      >
        {moments.map((moment, index) => (
          <button
            key={moment.time}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={selected === index}
            aria-controls={`${id}-panel`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              const target =
                event.key === "ArrowRight"
                  ? (index + 1) % 3
                  : event.key === "ArrowLeft"
                    ? (index + 2) % 3
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : null;
              if (target !== null) {
                event.preventDefault();
                setSelected(target);
                document.getElementById(`${id}-tab-${target}`)?.focus();
              }
            }}
          >
            <span>{moment.time}</span>
            {moment.label}
            <Icon name="arrow" />
          </button>
        ))}
      </div>
      <div
        className="moment-panel reveal"
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${selected}`}
        tabIndex={0}
      >
        <div className="moment-copy moment-enter" key={`copy-${selected}`}>
          <span className="moment-number">0{selected + 1}</span>
          <h3>{current.title}</h3>
          <p>{current.description}</p>
          <Link href="/products/electric-ceramic-cooker" className="text-link">
            Make it part of your day
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="moment-image">
          <span className="moment-time" aria-hidden="true">
            {current.time}
          </span>
          <Image
            key={current.image}
            className="moment-enter"
            src={current.image}
            alt={current.alt}
            width={1024}
            height={1024}
            sizes="(max-width: 700px) 90vw, 45vw"
          />
        </div>
      </div>
    </section>
  );
}
