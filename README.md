# Aura & Aether Parfums

Luxury fragrance storefront built with Next.js, TypeScript, Tailwind CSS, Prisma and PostgreSQL.

## Getting started

1. Install dependencies: `npm install`
2. Create a local `.env` file and configure `DATABASE_URL` for PostgreSQL and `AUTH_SECRET` with a long random secret.
3. Sync the Prisma schema and generate the client: `npx prisma db push` then `npx prisma generate`.
4. Start the development server: `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000).

## Storefront and admin

- The public homepage is `/`.
- The About page is `/about`.
- The administrator dashboard for products and orders is `/admin`.
- Storefront text settings are edited at `/admin/content` and stored in the `SiteSetting` PostgreSQL model.
- The site settings API is admin-write-protected at `/api/site-settings`.

The `SiteSetting` model is new; run `npx prisma db push` in each configured environment before using the content editor. Keep credentials in environment variables and never commit `.env`.

## Production notes

Configure the production PostgreSQL database and environment variables before deployment. Use a unique `AUTH_SECRET`; remove demo credentials before making the store publicly available. Configure Paystack keys through environment variables before accepting live payments.
