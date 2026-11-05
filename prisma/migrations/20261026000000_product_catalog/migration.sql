CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pricePkr" INTEGER NOT NULL CHECK ("pricePkr" >= 0),
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[] NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
-- The store reads through its server-side Prisma role only. No Data API policies.
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
