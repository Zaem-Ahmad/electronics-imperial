export const siteConfig = {
  name: "Electronics Imperial",
  catalogNavigation: false,
  whatsappNumber: "923339777207",
  availability: "12pm–9pm, Monday–Sunday",
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/",
  location: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "Karachi, Pakistan",
  contactDetailsReady: process.env.NEXT_PUBLIC_CONTACT_DETAILS_READY === "true",
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Our product" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Get in touch" },
];
