# Shahna (شحنة)

An online store for electric bicycles, built with Next.js 16 (App Router), Tailwind CSS 4 and MongoDB.

- **Arabic first**: the site opens in Arabic (right-to-left, IBM Plex Sans Arabic). Visitors can switch to English from the header, and the choice is saved in a `lang` cookie.

- **Storefront**: home page, catalogue with category, price, search and sort filters, product pages and a cart.
- **Ordering on WhatsApp**: checkout saves the order and opens WhatsApp with the order already typed out for the customer. No online payment.
- **Admin panel** at `/admin`: add, edit, hide or delete bikes, see orders and update their status. Protected by a single password.

## Run locally

1. Install Node.js 20.9+ and have MongoDB available (a local server or a free MongoDB Atlas cluster).
2. Copy the env template and fill it in:
   ```bash
   cp .env.example .env.local
   ```
3. Install and start:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:3000/admin, sign in with `ADMIN_PASSWORD`, go to **Bikes** and click **Load sample bikes** (or add your own).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | yes | MongoDB connection string |
| `MONGODB_DB` | no | Database name (default `shahna`) |
| `ADMIN_PASSWORD` | yes | Password for `/admin` |
| `SESSION_SECRET` | yes | Random string of 32+ characters that signs the admin cookie |
| `WHATSAPP_NUMBER` | recommended | Number that receives orders, international format, digits only (e.g. `970599123456`) |
| `NEXT_PUBLIC_CURRENCY` | no | ISO currency code for prices (default `USD`) |

All text lives in `src/lib/i18n/ar.ts` (Arabic, the main language) and `src/lib/i18n/en.ts`: store name, tagline, city, hours and every label. The email and the admin time zone are in `src/lib/site.ts`. Bikes are entered in Arabic, and each bike has optional English name and description fields; English visitors see the Arabic text when those are empty.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Create a MongoDB Atlas cluster (the free tier is fine). Under **Network Access**, allow `0.0.0.0/0`, because Vercel functions don't have fixed IPs. Copy the connection string.
3. In Vercel, click **Add New → Project** and import the repo. The Next.js preset needs no changes.
4. Add the environment variables above under **Settings → Environment Variables**, then deploy.
5. Visit `https://<your-app>.vercel.app/admin` and load or add your bikes.

Pages read from the database on every request, so admin changes show up straight away and the build doesn't need a database connection.

## Project layout

```
src/
  app/
    (store)/          storefront pages: home, /bikes, /bikes/[slug], /cart
    admin/login/      admin sign-in
    admin/(panel)/    dashboard, bikes and orders (all behind requireAdmin)
  components/         UI pieces: product card, bike illustration, cart store
  lib/                database access, auth, validation, WhatsApp message builder
``` 

## Notes

- Bikes without a photo get an illustrated bike in the product's accent colour. To use real photos, put them in `public/bikes/` and enter `/bikes/name.jpg`, or paste an `https://` image URL.
- Stock is not decremented automatically, because an order is only a request until you confirm it on WhatsApp. Adjust stock from the admin after a sale.
