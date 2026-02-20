# SEO Specification

## Overview
This document defines the SEO strategy for the Memes Concept Store MVP. The goal is to ensure pages are indexable, shareable on social media, and provide relevant metadata.

## 1. Global Metadata (`layout.tsx`)
- **Base Title**: `Memes Concept Store`
- **Title Template**: `%s | Memes Concept Store`
- **Default Description**: "The best memes in town. Buy exclusive meme-based merchandise."
- **Open Graph (OG)**:
  - Type: `website`
  - Site Name: `Memes Concept Store`
  - Locale: `en_US` (or `es_ES` if bilingual later)

## 2. Dynamic Product Pages (`/products/[slug]`)
- **Title**: `{Product Name} | Memes Concept Store`
- **Description**: First 160 characters of `{Product Description}`.
- **Open Graph**:
  - Type: `product`
  - Title: `{Product Name}`
  - Description: `{Product Description}`
  - Images: The first image of the product (`product.images[0]` or `imageUrl`).
  - Price: `{Product Price}` (Currency: USD).

## 3. Technical SEO
- **Robots.txt**:
  - Allow all bots by default.
  - Disallow `/admin` routes.
  - Point to `sitemap.xml`.
- **Sitemap (`sitemap.xml`)**:
  - Dynamic generation for all products.
  - Static generation for Home, Terms, Privacy.

## 4. Implementation Details (Next.js App Router)
- Use `generateMetadata` function in `page.tsx`.
- Use `metadataBase` in root layout for absolute URLs (requires `NEXT_PUBLIC_BASE_URL` env var).
