import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { SupportBanner } from "@/components/support-banner";

export const metadata = pageMetadata(
  "Our Story & Home Essentials",
  "Meet Electronics Imperial and our approach to everyday home essentials. Learn about our ceramic cooker, clear product information, and warranty support.",
  "/about",
);

export default function AboutPage() {
  return (
    <div className="container">
      <section className="about-intro">
        <div>
          <p className="eyebrow">HELLO. WE’RE ELECTRONICS IMPERIAL.</p>
          <h1>
            For the ordinary
            <br />
            moments that
            <br />
            <span>make a life.</span>
          </h1>
        </div>
        <div className="about-intro-note">
          <span className="small-line" />
          <p>
            The first cup of tea.
            <br />
            Dinner after a long day.
            <br />
            Something warm, shared together.
          </p>
          <p>We’re here for those moments.</p>
        </div>
      </section>
      <section className="about-story">
        <div className="about-image">
          <Image
            src="/images/ecc_3.png"
            alt="The ceramic cooker’s glowing heating surface and simple controls"
            width={1024}
            height={1024}
            sizes="(max-width: 800px) 90vw, 45vw"
          />
          <span>SMALL DETAILS. EVERYDAY DIFFERENCE.</span>
        </div>
        <div className="about-story-copy">
          <p className="eyebrow">A SIMPLE IDEA</p>
          <h2>
            Bring home
            <br />a little more ease.
          </h2>
          <p>
            Electronics Imperial is built around a simple belief: everyday
            essentials should make your day feel easier.
          </p>
          <p>
            We’re starting with one kitchen companion—the Electric Ceramic
            Cooker. A focused collection gives each product room to be
            understood, from the way it looks to the support that comes with it.
          </p>
          <p>Clear details. Thoughtful choices. No unnecessary clutter.</p>
          <Link href="/products" className="text-link">
            Meet our first essential
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <section className="section about-principles">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT MATTERS TO US</p>
            <h2>A few things we keep simple.</h2>
          </div>
        </div>
        <div className="principle-grid">
          <article>
            <span>01</span>
            <h3>Purpose in every product.</h3>
            <p>
              Essentials that have a place in your routine. We’re starting
              small, with a cooker designed for everyday use.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Clarity before checkout.</h3>
            <p>
              A clear price, product photos, and the full warranty details. So
              you can decide with the information you need.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Care beyond the purchase.</h3>
            <p>
              A 1-year limited warranty for eligible manufacturing and
              functional defects, with clear guidance on what’s covered.
            </p>
          </article>
        </div>
      </section>
      <section className="about-warranty">
        <Icon name="shield" width="52" height="52" />
        <div>
          <p className="eyebrow">CONFIDENCE, WITH THE DETAILS</p>
          <h2>A promise you can read.</h2>
          <p>
            Our warranty is written to be understood. Explore what’s covered,
            what isn’t, and what to keep when you purchase.
          </p>
          <Link
            href="/products/electric-ceramic-cooker#warranty"
            className="text-link"
          >
            Read the full warranty
            <Icon name="arrow" />
          </Link>
        </div>
        <span className="warranty-year">
          1
          <small>
            YEAR LIMITED
            <br />
            WARRANTY
          </small>
        </span>
      </section>
      <SupportBanner />
    </div>
  );
}
