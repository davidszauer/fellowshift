# FellowShift

A cozy touch-typing + language-learning app. Practice “blind typing” while the app:

- Tracks the physical key you pressed (`KeyboardEvent.code`) and the character it produced
- Supports multiple UI languages (`en`, `ru`, `hu`)
- Provides campaigns/lessons (including a LOTR-inspired RU campaign)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- Vitest

## Quickstart

```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

Note: the app uses locale-prefixed routes; visiting `/` redirects to your best-matching UI language (and stores it in a cookie).

## Playing a lesson

Routes are:

`/{locale}/play/{campaignId}/{lessonId}`

Example:

`http://localhost:3000/en/play/lotr-ru/bag-end-1`

## Scripts

```sh
npm run dev        # start dev server
npm run build      # production build
npm run start      # run production server
npm run lint       # next lint
npm test           # vitest run
npm run test:watch # vitest watch mode
```

## Where things live

- Campaign/lesson content: `src/features/progression/campaigns`
- Typing engine: `src/features/typing/engine`
- Keyboard layouts + virtual keyboard UI: `src/features/keyboard`
- i18n messages + helpers: `src/i18n`
