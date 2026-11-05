"use client";

import { useRouter } from "next/navigation";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <section className="container error-page">
      <p className="eyebrow">A SMALL INTERRUPTION</p>
      <h1>
        We couldn’t load
        <br />
        the collection.
      </h1>
      <p>Please try again in a moment.</p>
      <button
        type="button"
        className="button button-primary"
        onClick={() => {
          router.refresh();
          reset();
        }}
      >
        Try again
      </button>
    </section>
  );
}
