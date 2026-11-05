import Link from "next/link";
import { navigation, siteConfig } from "@/lib/site-config";
import { Icon } from "./icon";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand" href="/">
              <span>
                ELECTRONICS<span className="brand-dot">.</span>
              </span>
              <small>IMPERIAL</small>
            </Link>
            <p>
              Thoughtful essentials.
              <br />A little better, every day.
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <nav aria-label="Footer navigation">
              {navigation.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="footer-contact">
            <h2>Find us</h2>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.location)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="pin" />
              {siteConfig.location}
            </a>
            <p>Available {siteConfig.availability}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Electronics Imperial</span>
          <span>Made for the everyday.</span>
          <Link href="/products/electric-ceramic-cooker#warranty">
            Warranty &amp; care
            <Icon name="arrow" width="16" height="16" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
