export type Product = {
  id: string;
  slug: string;
  title: string;
  pricePkr: number;
  shortDescription: string;
  description: string;
  images: string[];
  active: boolean;
};

export type CartEntry = { id: string; quantity: number };
export type CartLine = CartEntry & { product: Product };
