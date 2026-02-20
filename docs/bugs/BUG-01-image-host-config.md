# Bug: Next.js Image Host Configuration

**Status**: OPEN
**Priority**: HIGH
**Assignee**: @frontend-developer

## Description
Runtime error when rendering `ProductGallery` component because `next/image` is attempting to load an external image from `i.imgflip.com` which is not configured in `next.config.ts`.

## Error Log
```
Error Type: Runtime Error
Error Message: Invalid src prop (https://i.imgflip.com/1ur9b0.jpg) on `next/image`, hostname "i.imgflip.com" is not configured under images in your `next.config.js`
```

## Reproduction
1. Visit any Product Detail Page (e.g., `/products/distracted-boyfriend`)
2. Page crashes with the above error.

## Proposed Solution
Update `next.config.ts` (or `next.config.mjs`) to allow `i.imgflip.com` in `images.remotePatterns`.

## Impact Code
- `frontend/next.config.ts`
