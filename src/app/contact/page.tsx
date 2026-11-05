import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Icon } from "@/components/icon";

export const metadata = pageMetadata(
  "Contact & Warranty Support",
  "Contact Electronics Imperial for ceramic cooker questions, payment, delivery, or warranty support. Available 12pm–9pm, Monday–Sunday, Pakistan time.",
  "/contact",
);

export default function ContactPage() {
  const whatsappReady = /^[1-9]\d{6,14}$/.test(siteConfig.whatsappNumber);
  return (
    <div className="container">
      <section className="page-intro">
        <p className="eyebrow">LET’S TALK ABOUT IT</p>
        <h1>
          A little help.
          <br />
          <span>A human touch.</span>
        </h1>
        <p>
          Product questions, warranty details, or your next kitchen essential.
          <br className="desktop-break" /> Start here. We’ll help you find your
          way.
        </p>
      </section>
      <section className="contact-grid">
        <article className="contact-primary">
          <Icon name="chat" width="36" height="36" />
          <h2>
            A conversation
            <br />
            is a good start.
          </h2>
          <p>
            Ask about the cooker, delivery, payment, or support for an eligible
            warranty issue.
          </p>
          {whatsappReady ? (
            <a
              className="button button-primary"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
            >
              Chat on WhatsApp
              <Icon name="arrow" />
            </a>
          ) : (
            <>
              <button className="button button-primary" type="button" disabled>
                WhatsApp coming soon
              </button>
              <p className="small muted">
                Our contact details are being finalized.
              </p>
            </>
          )}
        </article>
        <div className="contact-details">
          <article>
            <Icon name="chat" />
            <div>
              <p className="eyebrow">AVAILABLE HOURS</p>
              <p>{siteConfig.availability}</p>
            </div>
          </article>
          <article>
            <Icon name="pin" />
            <div>
              <p className="eyebrow">LOCATION</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.location)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.location}
                <Icon name="external" width="16" height="16" />
              </a>
              {!siteConfig.contactDetailsReady && (
                <p className="small muted">Contact us for location.</p>
              )}
            </div>
          </article>
        </div>
      </section>
      <section className="contact-warranty">
        <div>
          <p className="eyebrow">BEFORE YOU REACH OUT</p>
          <h2>Looking for warranty details?</h2>
          <p>
            Keep your proof of purchase handy. All claims are subject to
            inspection and confirmation of the fault.
          </p>
        </div>
        <Link
          href="/products/electric-ceramic-cooker#warranty"
          className="button button-outline"
        >
          Warranty &amp; care
          <Icon name="arrow" />
        </Link>
      </section>
    </div>
  );
}
