import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container error-page">
      <p className="eyebrow">404 · NOT HERE</p>
      <h1>
        Let’s get you
        <br />
        back home.
      </h1>
      <p>This page or product isn’t part of our collection.</p>
      <Link className="button button-primary" href="/products">
        Explore our product
      </Link>
    </section>
  );
}
