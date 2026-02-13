# SlideSnap Deployment Guide

SlideSnap adalah aplikasi photo puzzle game yang pure frontend—tidak ada backend atau database. Dapat di-deploy ke CDN mana saja.

## Prerequisites

- Node.js >= 18.18 && < 23
- npm >= 8.0

## Local Development

```bash
# Install dependencies
npm install

# Start frontend dev server with HMR
npm run dev
```

- Frontend: http://localhost:8080

## Production Build

```bash
npm run build
```

Menghasilkan file static di `dist/` folder, siap untuk CDN.

## Deployment Options

### Option 1: Cloudflare Pages ⭐ Recommended (Free)

1. Push code ke GitHub
2. Di Cloudflare dashboard → Pages → Create Project → Connect Git
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy!

Contoh: https://slidesnap.pages.dev

### Option 2: Vercel (Free)

1. Push ke GitHub
2. Ke [vercel.com](https://vercel.com) → Import Project
3. Select repository
4. Vercel auto-detects Vite, gunakan default settings
5. Deploy!

### Option 3: GitHub Pages

```bash
# Build
npm run build

# Deploy ke gh-pages branch
npm install -g gh-pages
npx gh-pages -d dist
```

### Option 4: Static Hosting Lainnya

Semua situs yang support static hosting bisa:
- Surge.sh
- Netlify
- Firebase Hosting
- AWS S3
- Google Cloud Storage

Cukup upload folder `dist/` setelah build.

## Performance

- Bundle size: ~200KB (gzipped)
- No server needed
- Works 100% offline (after caching)
- CDN-friendly

## Development

```bash
# Run tests
npm run test

# Watch tests
npm run test:watch

# Lint code
npm run lint

# Preview production build locally
npm run preview
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

SlideSnap © 2026 — Open Source
