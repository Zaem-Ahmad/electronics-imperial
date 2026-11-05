import type { Product } from "./types";

export const warrantyDescription = `1-Year Warranty – Electric Ceramic Cooker

Warranty Coverage:

✅ 1-Year Limited Warranty: Your electric ceramic cooker comes with a 1-year warranty covering manufacturing and functional defects under normal use.
✅ Heating Issues: If the cooker stops heating or does not heat properly due to a technical fault, we will assist you in resolving the issue.
✅ Wiring Issues: If the internal wiring develops a fault or a wire breaks due to a manufacturing defect, our team will assist with the necessary resolution.
✅ Control Knob Issues: If the control knob stops working due to a technical or manufacturing defect, we will help resolve the issue.

Warranty Exclusions:

❌ Broken or Cracked Glass: The ceramic glass surface is not covered under warranty. If the glass is broken, cracked, chipped, or damaged, warranty assistance will not be available for this issue.
❌ Physical or Accidental Damage: Damage caused by dropping, impact, misuse, mishandling, or improper use is not covered.
❌ Unauthorised Repairs: Damage resulting from unauthorised repairs or modifications is not covered.

Important Warranty Information:

Please keep your proof of purchase to claim warranty service.
All warranty claims are subject to inspection and confirmation of the fault.
The warranty covers eligible functional or manufacturing defects only and does not cover physical damage to the glass surface.

Shop with Confidence! Enjoy peace of mind with our 1-year limited warranty and support for eligible technical issues with your electric ceramic cooker.`;

export const cooker: Product = {
  id: "electric-ceramic-cooker",
  slug: "electric-ceramic-cooker",
  title: "Electric Ceramic Cooker",
  pricePkr: 10000,
  shortDescription: "1 year warranty",
  description: warrantyDescription,
  images: [
    "/images/ecc_0.png",
    "/images/ecc_1.png",
    "/images/ecc_2.png",
    "/images/ecc_3.png",
  ],
  active: true,
};
