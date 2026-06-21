# Street Scout — Premium Anime Streetwear E-Commerce

A premium, dark-mode anime streetwear ecommerce experience built with Next.js 16, TypeScript, Tailwind CSS, and Prisma. Features a secure admin panel for managing products, collections, and content without touching code.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Local Development](#local-development)
4. [Admin Panel Guide](#admin-panel-guide)
5. [Database & Data Storage](#database--data-storage)
6. [Security](#security)
7. [Deployment to Vercel](#deployment-to-vercel)
8. [Troubleshooting](#troubleshooting)

---

## Features

### Storefront
- **Cinematic video hero** — responsive desktop (landscape) + mobile (portrait) videos, autoplay, muted, infinite loop
- **Premium dark UI** — Japanese editorial design, manga-inspired panels, technical labels
- **Product catalog** — featured collection with quick-add, product detail modal with size selector
- **Shop By Universe** — 6 anime universe tiles (Naruto, One Piece, JJK, AOT, Demon Slayer, Solo Leveling)
- **Latest Drops** — editorial drop showcases
- **Lifestyle Lookbook** — "Worn In Every Scene" section
- **Slide-in cart drawer** with WhatsApp checkout (pre-filled order message)
- **Loading screen** — preloads all images + video before revealing site
- **Mute/unmute button** for hero video
- **Fly-to-cart animation** — snappy, GPU-accelerated

### Admin Panel (Secure)
- **Password-protected** dashboard
- **Product management** — add, edit, delete products with custom sizes, images, pricing (₹)
- **Collection management** — edit universes, drops, and lifestyle sections
- **Image upload** — drag & drop with automatic optimization (resize + WebP conversion)
- **No coding required** — manage everything from your browser or phone

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Prisma ORM + SQLite (local) / PostgreSQL (Vercel) |
| State | Zustand (cart) + React hooks |
| Icons | Lucide React |
| Image Processing | Sharp (resize + WebP on upload) |
| Fonts | Archivo Black (display), Geist (body), Noto Sans JP (Japanese) |

---

## Local Development

### Prerequisites

- **Node.js 18+** (or Bun)
- **Bun** (recommended) — install from https://bun.sh

### Setup

```bash
# 1. Clone or download the project
cd my-project

# 2. Install dependencies
bun install

# 3. Set up environment variables
#    Edit .env file with your admin password and secret:
#    DATABASE_URL=file:./db/custom.db
#    ADMIN_PASSWORD=YourStrongPasswordHere
#    ADMIN_SECRET=YourRandomSecretStringHere

# 4. Push database schema
bun run db:push

# 5. Seed initial products (6 anime jerseys)
bun run scripts/seed.ts

# 6. Seed content (universes, drops, lifestyle)
bun run scripts/seed-content.ts

# 7. Start the dev server
bun run dev
```

The site will be available at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server on port 3000 |
| `bun run lint` | Run ESLint to check code quality |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Regenerate Prisma Client |
| `bun run db:migrate` | Create a database migration |
| `bun run db:reset` | Reset database (deletes all data) |

---

## Admin Panel Guide

### Accessing the Admin Panel

There are two ways to open the admin panel:

1. **URL parameter**: Add `?admin=1` to your URL
   - Example: `http://localhost:3000/?admin=1`
   - Example: `https://yoursite.vercel.app/?admin=1`

2. **Keyboard shortcut**: Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)

### Logging In

- The login screen will ask for your **Administrator Password**
- This is the `ADMIN_PASSWORD` value in your `.env` file
- Default password: `StreetScout2025!Secure` (change this immediately!)
- After 5 failed attempts, you'll be rate-limited for 60 seconds

### Managing Products

1. **View all products**: The Products tab shows all items in a table
2. **Add a product**: Click "Add New Product" → fill the form → Save
3. **Edit a product**: Click the pencil icon → modify fields → Save
4. **Delete a product**: Click the trash icon → confirm deletion
5. **Toggle Featured**: Click the "On/Off" toggle to show/hide in Featured Collection
6. **Toggle In Stock**: Control whether a product is purchasable

#### Product Fields Explained

| Field | Description | Example |
|-------|-------------|---------|
| Name | Product name | Shadow Monarch Jersey |
| Slug | URL identifier (auto-generated) | shadow-monarch-jersey |
| Collection | Collection series name | Gate Series |
| Collection Tag | Short tag shown on cards | SOLO LEVELING COLLECTION |
| Drop Number | Drop identifier | DROP-006 |
| Universe | Anime universe | Solo Leveling |
| Universe (JP) | Japanese name | 俺だけレベルアップな件 |
| Price | Price in INR (₹) | 3299 |
| Description | Full product description | Arise. The flagship jersey... |
| Fabric | Material info | Premium Tech Fleece |
| Fit | Fit description | Oversized Drop-Shoulder |
| Breathability | Ventilation info | Thermal Regulation |
| Durability | Durability rating | Heavy-Duty Construction |
| Sizes | Comma-separated sizes | XS,S,M,L,XL,XXL |
| Front Image | Main product image | (upload or URL) |
| Back Image | Secondary product image | (upload or URL) |

### Managing Collections

- **Universes tab**: Edit the "Shop By Universe" section tiles
- **Drops tab**: Edit the "Latest Drops" section showcases
- **Lifestyle tab**: Edit the "Worn In Every Scene" lookbook section

Each tab supports full CRUD (Create, Read, Update, Delete) with image uploads.

### Image Uploads

- **Drag & drop** or click to browse
- Supported formats: JPG, PNG, WebP, GIF
- Max file size: 5MB
- Images are **automatically optimized**:
  - Resized to max 1200×1600px (preserves aspect ratio, no stretching)
  - Converted to WebP format (smaller file, same quality)
  - Saved to `/public/uploads/` with a random UUID filename
- You can also paste an image URL directly

---

## Database & Data Storage

### Where Your Data Is Stored

#### Development (Local)

- **Database file**: `db/custom.db` (SQLite file)
  - This is a single file containing all your products, universes, drops, and lifestyle data
  - Located at: `/home/z/my-project/db/custom.db` (or your project's `db/` folder)

- **Uploaded images**: `public/uploads/` folder
  - All images uploaded via the admin panel are saved here
  - Files are named with UUIDs (e.g., `a1b2c3d4-...webp`)

- **Static images**: `public/images/` folder
  - Pre-generated images (hero background, product mockups, universe tiles, lifestyle)
  - These were AI-generated during initial setup

- **Hero videos**: `public/videos/` folder
  - `hero-bg.mp4` — desktop/landscape video
  - `hero-bg-mobile.mp4` — mobile/portrait video

- **Environment variables**: `.env` file
  - Database URL, admin password, admin secret

#### Production (Vercel)

- **Database**: PostgreSQL (via Vercel Postgres or external provider)
  - SQLite doesn't work on Vercel (serverless = no persistent filesystem)
  - See [Deployment section](#deployment-to-vercel) for setup

- **Uploaded images**: Vercel Blob (or external storage like Cloudinary/AWS S3)
  - The `public/uploads/` folder is NOT persistent on Vercel
  - You must configure blob storage for image uploads to work in production

- **Static assets**: Bundled with the deployment
  - Files in `public/` are served as static assets

### Database Schema

```
Product
├── id, name, slug
├── collection, collectionTag, dropNumber
├── universe, universeJp
├── price, description
├── fabric, fit, breathability, durability
├── sizes (comma-separated: "XS,S,M,L,XL,XXL")
├── imageFront, imageBack
├── accentColor
├── isFeatured, inStock
└── createdAt, updatedAt

Universe
├── id, name, japanese, dropNumber
├── image, order
└── createdAt, updatedAt

Drop
├── id, number, japanese, title
├── description, status, image, order
└── createdAt, updatedAt

Lifestyle
├── id, label, japanese, tag
├── description, image, order
└── createdAt, updatedAt
```

### Backing Up Your Data

#### Local
```bash
# Back up the database
cp db/custom.db db/custom-backup-$(date +%Y%m%d).db

# Back up uploaded images
cp -r public/uploads public/uploads-backup-$(date +%Y%m%d)
```

#### Production
- Database: Use your provider's backup tools (Vercel Postgres has automatic backups)
- Images: Vercel Blob has built-in redundancy

---

## Security

### Authentication

1. **Password hashing**: Admin password is hashed with SHA-256 + salt (HMAC)
2. **Timing-safe comparison**: Prevents timing attacks on password verification
3. **Session tokens**: HMAC-signed tokens with expiry (24 hours)
4. **HTTP-only cookies**: Session cookie can't be accessed by JavaScript
5. **SameSite=strict**: Prevents CSRF attacks
6. **Secure flag**: Cookie only sent over HTTPS in production

### API Protection

- Every `/api/admin/*` route checks authentication before processing
- Public routes (`/api/products`, `/api/content/*`) are read-only
- No admin actions can be performed without a valid session

### Rate Limiting

- Login endpoint: 5 attempts per minute per IP address
- Prevents brute-force password attacks

### Image Upload Security

1. **File type validation**: Checks both extension AND magic bytes
2. **File size limit**: Max 5MB
3. **Filename sanitization**: Uses `crypto.randomUUID()` for filenames
4. **Path traversal prevention**: Filenames can't contain path separators
5. **Image processing**: Sharp library processes and re-encodes the image

### Input Sanitization

- All text inputs are trimmed and length-limited
- Prices are clamped to non-negative numbers
- Slugs are sanitized to URL-safe characters
- Sizes are parsed, uppercased, and filtered for empty values

---

## Deployment to Vercel

### Step 1: Prepare Your Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub

```bash
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/street-scout.git
git branch -M main
git push -u origin main
```

### Step 3: Set Up Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### Step 4: Set Up Database (PostgreSQL)

Since SQLite doesn't work on Vercel's serverless platform, you need PostgreSQL:

**Option A: Vercel Postgres (Easiest)**

1. In your Vercel project dashboard, go to "Storage"
2. Click "Create Database" → select "Postgres"
3. Name it (e.g., `street-scout-db`)
4. Vercel automatically sets the `DATABASE_URL` environment variable

**Option B: External Provider (Neon, Supabase, Railway)**

1. Create a PostgreSQL database at [neon.tech](https://neon.tech) (free tier)
2. Copy the connection string
3. You'll add this as `DATABASE_URL` in Vercel env vars

### Step 5: Update Prisma Schema for PostgreSQL

Edit `prisma/schema.prisma` — change the datasource:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then commit and push:

```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

### Step 6: Set Environment Variables in Vercel

In your Vercel project settings → "Environment Variables", add:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | (auto-set by Vercel Postgres) | Your PostgreSQL connection string |
| `ADMIN_PASSWORD` | `YourStrongPassword123!` | Choose a strong password |
| `ADMIN_SECRET` | (random 32+ char string) | Generate at random.org |

### Step 7: Deploy & Initialize Database

1. Vercel will automatically deploy when you push to `main`
2. After the first deploy, run the database migration:

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Link your project
vercel link

# Run Prisma migration on production
vercel env pull .env.production.local
bunx prisma db push --production
```

3. Seed initial data (optional — only if you want the demo products):

```bash
# Set DATABASE_URL to production, then:
bun run scripts/seed.ts
bun run scripts/seed-content.ts
```

### Step 8: Set Up Image Storage (Vercel Blob)

For image uploads to work in production, you need Vercel Blob:

1. In Vercel dashboard → "Storage" → "Create Blob Store"
2. Name it (e.g., `street-scout-uploads`)
3. Install the Blob SDK:
   ```bash
   bun add @vercel/blob
   ```
4. Update `src/app/api/admin/upload/route.ts` to use Vercel Blob instead of local filesystem
   (The local file upload works in development; for production, replace the `writeFile` section with Vercel Blob's `put()` function)

### Step 9: Access Your Live Site

- Your site is live at `https://your-project.vercel.app`
- Admin panel: `https://your-project.vercel.app/?admin=1`
- Log in with the `ADMIN_PASSWORD` you set

### Post-Deployment Checklist

- [ ] Database schema pushed (`prisma db push`)
- [ ] Products seeded (if needed)
- [ ] Content seeded (if needed)
- [ ] Admin password changed from default
- [ ] Admin secret is a random string
- [ ] Image upload works (Vercel Blob configured)
- [ ] Hero videos load correctly
- [ ] WhatsApp checkout generates correct message

---

## Troubleshooting

### Dev server won't start

```bash
# Kill any existing processes on port 3000
pkill -f "next dev"

# Clear Next.js cache
rm -rf .next

# Restart
bun run dev
```

### Database errors

```bash
# Reset the database (WARNING: deletes all data)
rm db/custom.db
bun run db:push
bun run scripts/seed.ts
bun run scripts/seed-content.ts
```

### Prisma Client errors

```bash
# Regenerate the Prisma Client
bun run db:generate
```

### Hydration mismatch errors

- These are usually caused by browser extensions modifying the DOM
- The video elements have `suppressHydrationWarning` to handle this
- If you see errors, try in incognito mode (no extensions)

### Video not playing on mobile (Chrome)

- Videos must be muted to autoplay on mobile browsers
- The hero video is muted by default with a manual unmute button
- If video stutters, check that it's 30fps (not 60fps) — re-encode with:
  ```bash
  ffmpeg -i input.mp4 -vf "fps=30" -c:v libx264 -crf 23 -movflags +faststart output.mp4
  ```

### Images look stretched

- Product images use `object-contain` (preserves aspect ratio)
- If an image looks wrong, check that it was uploaded through the admin panel
- The upload route automatically resizes and converts to WebP

### Admin panel not appearing

- Make sure you're using `?admin=1` in the URL (not `?admin=true`)
- Or press `Ctrl+Shift+A` / `Cmd+Shift+A`
- Clear your browser cache and cookies, then try again

### Forgot admin password

- Edit the `.env` file: change `ADMIN_PASSWORD` to your new password
- Restart the dev server: `bun run dev`
- For production: update the `ADMIN_PASSWORD` env var in Vercel dashboard

---

## Project Structure

```
my-project/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── images/                # Static images (AI-generated)
│   ├── uploads/               # User-uploaded images (admin panel)
│   └── videos/                # Hero background videos
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/         # Protected admin API routes
│   │   │   ├── content/       # Public content API routes
│   │   │   └── products/      # Public product API routes
│   │   ├── globals.css        # Global styles + animations
│   │   ├── layout.tsx         # Root layout (fonts, metadata)
│   │   └── page.tsx           # Main page (storefront + admin trigger)
│   ├── components/
│   │   ├── admin/             # Admin panel components
│   │   │   ├── admin-panel.tsx
│   │   │   └── image-upload.tsx
│   │   ├── site/              # Storefront components
│   │   │   ├── hero.tsx       # Video hero section
│   │   │   ├── navbar.tsx     # Floating navbar
│   │   │   ├── featured-collection.tsx
│   │   │   ├── shop-by-universe.tsx
│   │   │   ├── drops.tsx
│   │   │   ├── lifestyle.tsx
│   │   │   ├── product-detail.tsx
│   │   │   ├── cart-drawer.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── loading-screen.tsx
│   │   │   ├── fly-to-cart.tsx
│   │   │   └── ...
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       ├── auth.ts            # Admin authentication
│       ├── cart-store.ts      # Zustand cart store
│       ├── data.ts            # Helpers (formatINR)
│       ├── db.ts              # Prisma client
│       ├── types.ts           # TypeScript types
│       └── whatsapp.ts        # WhatsApp checkout message
├── scripts/
│   ├── seed.ts                # Seed products
│   └── seed-content.ts        # Seed universes, drops, lifestyle
├── .env                       # Environment variables
├── package.json
└── README.md                  # This file
```

---

## License

This is a private project for Street Scout. All rights reserved.
