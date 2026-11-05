import Link from "next/link";
import { Icon } from "./icon";

export function SupportBanner() {
  return (
    <section className="support-banner">
      <div>
        <p className="eyebrow">LET’S MAKE IT SIMPLE</p>
        <h2>A question before you cook?</h2>
        <p>Find the details you need, with a little help from us.</p>
      </div>
      <Link className="button button-light" href="/contact">
        Get in touch
        <Icon name="arrow" />
      </Link>
    </section>
  );
}
