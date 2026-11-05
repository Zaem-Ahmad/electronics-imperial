import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/site-config";
import { Icon } from "./icon";
import { ProductCard } from "./product-card";
import { SupportBanner } from "./support-banner";
import { HomeMotion } from "./home-motion";
import { CookingMoments } from "./cooking-moments";
import { CookerDetails } from "./cooker-details";
import { CatalogSync } from "./store-provider";

const questions = [
  [
    "What does the 1-year warranty cover?",
    "The limited warranty covers eligible manufacturing and functional defects under normal use, including technical issues with heating, internal wiring, and the control knob. All claims are subject to inspection.",
  ],
  [
    "Is the ceramic glass covered?",
    "Broken, cracked, chipped, or otherwise damaged ceramic glass is not covered. Physical damage, accidental damage, misuse, and damage from unauthorised repairs are also excluded.",
  ],
  [
    "What should I keep for a warranty claim?",
    "Keep your proof of purchase. Our team will need to inspect and confirm the fault before determining warranty eligibility.",
  ],
  [
    "How do I place an order?",
    /^[1-9]\d{6,14}$/.test(siteConfig.whatsappNumber)
      ? "Add the cooker to your bag, choose your quantity, and continue to WhatsApp to confirm payment and delivery details."
      : "Once WhatsApp ordering is available, add the cooker to your bag, choose your quantity, and continue to WhatsApp to confirm payment and delivery details. For now, you can explore the product and save it in your bag.",
  ],
];

export default async function HomePage() {
  const products = await getProducts();
  return (
    <HomeMotion>
      <CatalogSync products={products} />
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow hero-arrive">
            <span className="small-line" />
            FOR THE WAY YOU LIVE
          </p>
          <h1 className="hero-arrive hero-arrive-1">
            A little heat.
            <br />A lot of <span>possibility.</span>
          </h1>
          <p className="hero-description hero-arrive hero-arrive-2">
            Simple essentials for the moments that matter.
            <br className="desktop-break" /> Meet your new everyday cooking
            companion.
          </p>
          <div className="hero-actions hero-arrive hero-arrive-3">
            <Link className="button button-primary" href="/products">
              Meet the cooker
              <Icon name="arrow" />
            </Link>
            <Link className="text-link" href="/about">
              The Electronics Imperial story
              <Icon name="arrow" />
            </Link>
          </div>
          <div className="hero-footnote hero-arrive hero-arrive-3">
            <Icon name="shield" />
            <span>
              1-year limited warranty.
              <br />
              <strong>A little more peace of mind.</strong>
            </span>
          </div>
          <a href="#the-everyday" className="scroll-invitation">
            <span className="scroll-line" />
            TAKE A LITTLE LOOK AROUND
          </a>
        </div>
        <div className="hero-visual hero-arrive hero-arrive-2">
          <div className="hero-image">
            <Image
              src="/images/ecc_1.png"
              alt="Electric ceramic cooker with a pan, ready for everyday cooking"
              width={1024}
              height={1024}
              sizes="(max-width: 800px) 90vw, 48vw"
              preload
            />
          </div>
          <span className="hero-image-tag">THE KITCHEN, REIMAGINED</span>
          <div className="hero-orbit-badge">
            <Icon name="flame" />
            <span>
              A LITTLE
              <br />
              EVERYDAY MAGIC
            </span>
          </div>
          <div className="hero-caption">
            <span>Electric Ceramic Cooker</span>
            <Link
              href="/products/electric-ceramic-cooker"
              aria-label="Explore Electric Ceramic Cooker"
            >
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
      <div className="values-strip">
        <div className="container">
          <span>
            <Icon name="shield" />
            1-year limited warranty
          </span>
          <span>
            <Icon name="flame" />
            Made for everyday cooking
          </span>
          <span>
            <Icon name="chat" />
            Support for eligible technical issues
          </span>
        </div>
      </div>
      <section id="the-everyday" className="manifesto container section">
        <p className="eyebrow reveal">
          A SMALL CHANGE. AN EVERYDAY DIFFERENCE.
        </p>
        <h2 className="reveal">
          Life happens in the kitchen.
          <br />
          <span>The little rituals.</span> The shared plates.
          <br />
          The <em>“just one more bite.”</em>
        </h2>
        <div className="manifesto-bottom reveal">
          <span className="small-line" />
          <p>
            Make room for an essential that belongs in all of it.
            <br />
            Meet Electronics Imperial’s Electric Ceramic Cooker.
          </p>
          <span className="manifesto-number">
            01
            <span>
              PRODUCT.
              <br />
              COUNTLESS MOMENTS.
            </span>
          </span>
        </div>
      </section>
      <section className="container collection-section section" id="products">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">LESS CLUTTER. MORE PURPOSE.</p>
            <h2>
              One essential.
              <br />
              So many possibilities.
            </h2>
          </div>
          <span className="section-index">01 / THE COLLECTION</span>
        </div>
        <div className="reveal">
          {products.length ? (
            products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))
          ) : (
            <div className="empty-catalog">
              <h3>Something good is on its way.</h3>
              <p>
                Our collection is currently being updated. Please check back
                soon.
              </p>
            </div>
          )}
        </div>
      </section>
      <div className="moving-type" aria-hidden="true">
        <div className="moving-type-track">
          {[0, 1, 2, 3].map((index) => (
            <span key={index}>
              GOOD FOOD.
              <Icon name="flame" />
              GOOD COMPANY.
              <Icon name="flame" />
              EVERYDAY ELECTRONICS IMPERIAL.
              <Icon name="flame" />
            </span>
          ))}
        </div>
      </div>
      <CookingMoments />
      <CookerDetails />
      <section className="confidence-section container section">
        <div className="confidence-number reveal">
          <span>1</span>
          <div>
            YEAR LIMITED
            <br />
            WARRANTY
          </div>
          <Icon name="shield" width="56" height="56" />
        </div>
        <div className="confidence-copy reveal">
          <p className="eyebrow">THE REASSURANCE COMES WITH IT</p>
          <h2>
            Bring it home.
            <br />
            <span>We’ll be here.</span>
          </h2>
          <p>
            A good essential deserves clear support. Your cooker includes a
            1-year limited warranty for eligible manufacturing and functional
            defects.
          </p>
          <ul>
            <li>
              <Icon name="check" />
              Heating issues
            </li>
            <li>
              <Icon name="check" />
              Internal wiring faults
            </li>
            <li>
              <Icon name="check" />
              Control knob defects
            </li>
          </ul>
          <p className="small muted">
            Physical damage, including broken or cracked glass, is not covered.
            Claims are subject to inspection.
          </p>
          <Link
            className="text-link"
            href="/products/electric-ceramic-cooker#warranty"
          >
            All the details. No guesswork.
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <section className="story-band">
        <div className="container story-band-inner">
          <div className="reveal">
            <p className="eyebrow">THE ELECTRONICS IMPERIAL WAY</p>
            <h2>
              Less, but
              <br />
              <em>more meaningful.</em>
            </h2>
            <p>
              We believe the things you bring home should earn their place.
              Useful, considered essentials. Clear product details. And support
              that starts with understanding what you need.
            </p>
            <Link href="/about" className="button button-light">
              Our story, simply told
              <Icon name="arrow" />
            </Link>
          </div>
          <div className="story-art reveal" aria-hidden="true">
            <span className="story-circle story-circle-one" />
            <span className="story-circle story-circle-two" />
            <span className="story-circle story-circle-three" />
            <span className="story-word">
              The
              <br />
              everyday
              <br />
              <em>matters.</em>
            </span>
            <span className="story-art-caption">
              ELECTRONICS IMPERIAL — MADE FOR YOUR DAY
            </span>
          </div>
        </div>
      </section>
      <section
        className="faq-section container section"
        aria-labelledby="faq-heading"
      >
        <div className="reveal">
          <p className="eyebrow">A FEW GOOD QUESTIONS</p>
          <h2 id="faq-heading">
            Before the
            <br />
            first cook.
          </h2>
          <p className="faq-intro">
            A little clarity goes a long way.
            <br />
            Here are the things worth knowing.
          </p>
          <Link href="/contact" className="text-link">
            Still curious? Get in touch
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="faq-list reveal">
          {questions.map(([question, answer], index) => (
            <details key={question}>
              <summary>
                <span className="faq-number">0{index + 1}</span>
                <span>{question}</span>
                <Icon name="plus" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="container reveal">
        <SupportBanner />
      </div>
    </HomeMotion>
  );
}
