# Electronics Imperial

A Next.js storefront for the Electric Ceramic Cooker. The landing page includes animated product imagery, scroll reveals, cooking-moment tabs, interactive product details, warranty information, and FAQs. Light/dark themes, a local cart, and temporary reviews work independently.

## Run locally

Use Node.js 22.13+ on the Node 22 line, or Node 24, with npm.

```sh
npm ci
npm run db:generate
npm run dev
```

Open http://localhost:3000. No credentials are needed for demo mode. Copy `.env.example` to `.env` when configuring the backend. Keep `.env` untracked.

```sh
npm run build
npm start
```

The application uses Next.js 16.4.3, React 19, Tailwind CSS 4, and stable Prisma 7. Exact resolved versions are committed in `package-lock.json`. If a restricted environment prevents Turbopack from opening its internal worker port, `npm run build:webpack` uses Next.js’s supported webpack builder instead. For development in an environment that allows a web server but blocks Turbopack workers, use `npm run dev -- --webpack`.

## Catalog modes

- `CATALOG_SOURCE=demo` (default): renders the single cooker from `src/lib/product-data.ts` without database access.
- `CATALOG_SOURCE=database`: reads active products from Supabase PostgreSQL through server-only Prisma. Invalid configuration or database failures produce an error state; they do not fall back to demo data. Database reads happen at request time.

The cooker seed contains its Rs 10,000 price, exact warranty wording, and `/images/ecc_0.png` through `/images/ecc_3.png` in order. Only `ecc_0.png` is used as the card image and initial gallery image. Prices are stored as integer whole Pakistani rupees.

## Connect Supabase

1. Create a new Supabase project. In its Connect dialog, obtain a session-pooler connection (port 5432) for migrations and a transaction-pooler connection (port 6543) for a serverless runtime. Direct connections are also suitable for migrations when IPv6 is available.
2. Follow [Supabase’s Prisma setup](https://supabase.com/docs/guides/database/prisma) to create a dedicated Prisma database role with the required schema privileges. The server role must be able to access the catalog despite RLS; the recommended Supabase Prisma role uses `BYPASSRLS`. Keep its password server-side. This integration does not need a public Supabase API key, auth SDK, or browser database client.
3. Set `DIRECT_URL` to the session/direct connection and `DATABASE_URL` to the runtime connection in `.env`. URL-encode special characters in the password. Use a new database for these migrations; inspect an existing schema before applying them to an existing project.
4. Apply the migration and seed:

```sh
npm run db:validate
npm run db:migrate
npm run db:seed
```

5. Set `CATALOG_SOURCE=database`, then restart the application. Confirm that the cooker loads. Seeding again updates this product by slug rather than creating duplicates; it does not delete unrelated database records.

The migration enables RLS with no anonymous policies. Browser clients cannot read or write catalog rows through Supabase’s Data API. The Next.js server reads using Prisma; there are no public product-write routes. If the Supabase project is solely for Prisma, you can disable its Data API as advised by Supabase.

Prisma config uses `DIRECT_URL`; its dummy localhost URL only allows client generation and schema validation without secrets. It is not a working backend. The seed refuses to run without a real `DIRECT_URL`.

No Supabase project has been provisioned or connected as part of the local build. Live connection, role permissions, and pooling must be verified when credentials are supplied.

## Contact details and ordering

Edit `.env` or your host’s environment variables:

- WhatsApp ordering is configured as `923339777207` in `src/lib/site-config.ts`. Quick add and Add to bag save the selection and open WhatsApp with the updated bag bill. Direct product ordering uses the selected product quantity; bag checkout uses all items in the bag. Messages include item count, quantities, unit prices, totals, and a request for account and order details.
- `NEXT_PUBLIC_CONTACT_LOCATION`: replace the temporary Karachi location.
- `NEXT_PUBLIC_FACEBOOK_URL`: replace the generic Facebook destination with your page URL.
- `NEXT_PUBLIC_CONTACT_DETAILS_READY=true`: remove the placeholder labels only after updating those details.
- `SITE_URL`: the real deployed origin, used for metadata, robots, and sitemap. Without it, indexing is disabled and the sitemap is empty.

Public environment values are embedded at build time, so rebuild after changing contact details. `src/lib/site-config.ts` centralizes the settings and the currently disabled catalog-navigation flag. No company icon is included in the navbar; the favicon is a text monogram.

## Cart, reviews, and motion

The cart persists in local storage under `imperial-cart-v1`. Invalid entries and retired products are excluded, quantities range from 1–99, and pricing comes from the catalog. Storage failures fall back to memory. No orders or payments are submitted to a backend.

Reviews use component state only, start empty, and disappear on refresh or leaving the product page. The review form tells visitors this. No review content enters local/session storage or a database, and fictional sample reviews are clearly labeled and excluded from customer rating totals.

The homepage supports reduced-motion preferences and a visible animation toggle. Interactive tabs support keyboard arrow keys; menu and cart use native modal dialogs for focus containment and Escape handling.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run test:db
npm run build
npx playwright install chromium
npm run test:e2e
```

Database checks use an isolated, in-memory PostgreSQL-compatible PGlite instance. They validate the actual SQL migration, data constraints, image order, and RLS. To additionally run the real Prisma seed twice over a local PostgreSQL socket, set `RUN_PRISMA_SOCKET_TESTS=true` before `npm run test:db`. This test creates and closes its own database; it does not use Supabase or another project’s database.

Playwright starts and stops an isolated production server on port 3100. Tests cover theme stability, cart operations/persistence, temporary reviews, image order, quantity limits, homepage interactions, menu focus, unknown products, and page widths from 360–1920px. `PLAYWRIGHT_CHANNEL=chrome` can use an already installed Chrome. The GitHub Actions workflow runs on Linux and Windows and adds Microsoft Edge on Windows. CSS zoom checks approximate 125%/150% scaling; actual Windows display scaling still deserves a visual check.

This implementation was checked with lint, TypeScript, unit and DOM interaction tests, schema validation, an in-memory migration test, and a webpack production build. This workspace’s sandbox blocks local listening ports and Chrome launches, so browser/visual tests and the socket-based Prisma integration test could not run here. The workflow is supplied but has not been run on GitHub.

## Hosting

Use a Node.js-capable Next.js host when connecting the database. This is not a static-export application. Set environment variables on the host, apply migrations during a controlled release step, seed the product once, and build/deploy the application. No deployment, auth, admin dashboard, payment integration, or persistent review/order system is included.

## SEO configuration

Vercel automatically supplies `VERCEL_PROJECT_PRODUCTION_URL`, which the app uses for SEO URLs. On other hosts, or to override the domain, set `SITE_URL` to the final public origin (for example, `https://your-domain.com`, with no path) before the production build. Page canonicals, Open Graph URLs, organization and breadcrumb structured data, and `/sitemap.xml` use this origin. Missing both `SITE_URL` and the Vercel production domain keeps the site non-indexable. Set `SITE_INDEXABLE=false` on staging; Vercel preview deployments are also excluded from indexing. Rebuild when these settings change.

Every public page has its own title, description, and social preview. Product metadata and Product/Offer structured data use the current catalog price. Fictional reviews are excluded from structured data and rating totals. Stock status, delivery guarantees, and a physical business address are not asserted without confirmed data.

To verify ownership in Google Search Console, optionally set `GOOGLE_SITE_VERIFICATION` to the HTML verification token and rebuild. After deployment, submit `/sitemap.xml`, inspect the product URL with Google's Rich Results Test, and check PageSpeed Insights on mobile. Search Console submission, real search performance, and production Core Web Vitals require the live domain and are not verified by local checks.

SEO review followed the [SEO Audit skill](https://skills.sh/coreyhaines31/marketingskills/seo-audit). The initial gaps were missing canonical tags, incomplete page social metadata, and missing organization/breadcrumb data. Deployment indexing still depends on the final public domain. Search queries are targeted descriptively; no keyword-volume or ranking claims are made.

## Deploy on Vercel

Import the GitHub repository into Vercel, use the detected Next.js preset, and select Node.js 22.x. The default build command generates the Prisma client before building Next.js. Use `CATALOG_SOURCE=demo` to deploy the current cooker catalog without database credentials. For database mode, configure the Supabase runtime and migration URLs described above.

Keep system environment variables enabled so SEO can use `VERCEL_PROJECT_PRODUCTION_URL` automatically. Production is indexable; preview deployments remain non-indexable. WhatsApp ordering uses +92 333 9777207. No email address is required. The `.vercel` directory and environment files are excluded from Git.
