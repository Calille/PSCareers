# Public Sector Careers (PS Careers)

Website for **Public Sector Careers** — a UK public sector recruitment specialist connecting professionals with councils, agencies and government teams.

Live domain (production): [pscareers.co.uk](https://pscareers.co.uk)

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — bespoke design system (purple primary, green accent, full neutral scale)
- **Framer Motion** — subtle scroll and load animations
- **lucide-react** — icon set
- **Plus Jakarta Sans** — typography (via `next/font`)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:3000)
npm run dev

# 3. Build for production
npm run build

# 4. Run the production build locally
npm run start
```

Other scripts:

```bash
npm run lint     # ESLint
npm run format   # Prettier
```

## Deployment

The project deploys to **[Vercel](https://vercel.com/)** for automatic preview builds on every push and production deploys from `main`.

A previous configuration supported static export for cPanel — that is preserved as a commented block at the top of [`next.config.js`](./next.config.js) should we need to switch back.

## Project structure

```
.
├── app/                  # App Router pages and layouts
│   ├── layout.tsx        # Root layout (Navigation + Footer + global metadata)
│   ├── page.tsx          # Homepage
│   ├── globals.css       # Tailwind layers + design tokens
│   ├── jobs/             # Job search (stub)
│   ├── staff/            # Staff page (stub)
│   ├── post-a-job/       # Employer CTA (stub)
│   ├── register/         # Registration (stub)
│   ├── about/            # About (stub)
│   └── contact/          # Contact (stub)
├── components/
│   ├── Navigation.tsx    # Sticky nav with mobile overlay
│   ├── Footer.tsx        # Three-column footer
│   ├── Logo.tsx          # Text-based PS Careers mark
│   ├── Section.tsx       # Scroll-triggered fade-up wrapper
│   ├── ComingSoon.tsx    # Shared placeholder page
│   └── home/             # Homepage sections (Hero, Trust, Staff, Register CTA)
├── lib/
│   ├── mockData.ts       # Placeholder jobs & staff (until Supabase is wired in)
│   ├── nav.ts            # Shared nav link config
│   └── utils.ts          # `cn()` class helper
├── types/                # Shared TypeScript types
├── public/               # Static assets
├── tailwind.config.ts    # Design system tokens
└── next.config.js        # Next.js config (Vercel)
```

## Roadmap

- **Phase 1 (current)** — foundation, design system, homepage, nav/footer, stub pages
- **Phase 2** — job search & detail pages
- **Phase 3** — Supabase integration for live jobs, registration, and admin

## Licence

Proprietary — © Public Sector Careers Ltd.
