# EcoQuest SG 🇸🇬

**EcoQuest SG** is an adaptive sustainability platform and gamified mobility agent that transforms raw public transit utilities into a holistic behavior-change ecosystem. 

Unlike generic carbon footprint calculators that rely on Western approximations, EcoQuest SG interfaces directly with Singapore's official data infrastructure to drive real-world habit formation across three core pillars: **Transport, Food, and Energy**.

### 🚀 Key Features
* **Deterministic Verification Loop:** A privacy-first, sensor-free transit tracker that validates user arrivals by cross-referencing one-off geofenced pings with live LTA schedules—eliminating heavy background battery drain.
* **Cross-Category Adaptive Agent:** An intelligent nudge engine that adapts tomorrow's task difficulties based on today's habit compliance (e.g., tracking an MRT walk dynamically calibrates a local plant-based food nudge and scales down your home energy saving targets).
* **Gamified Ecosystem:** Built-in streak mechanics and "Streak Coin" rewards to incentivize eco-conscious commuting and align with the Singapore Green Plan.

### 🛠️ Production Infrastructure
* **SLA OneMap API:** Geocoding, reverse-geocoding, and hyper-local routing vectors.
* **LTA Datamall:** Real-time bus arrivals (v2 JSON parameters for seating loads) and automated train service alerts.
* **Tailwind CSS:** Premium, presentation-ready dark mode UI designed explicitly for mobile view emulation.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
