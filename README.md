# htenlikOS

[htenlikOS](https://htenlik.com) is Hüseyin Tenlik's interactive software engineering portfolio, presented as an original early-2000s desktop environment.

It combines a functional window manager, classic desktop interactions, structured portfolio content, and a faithful Minesweeper experience. The visual assets are original and recreate the character of period desktop software without distributing proprietary Microsoft artwork or system files.

## Highlights

- Selectable and movable desktop shortcuts with persistent, grid-aligned positions
- Classic shortcut and desktop context menus
- Draggable, resizable, minimizable, maximizable application windows
- Taskbar, Start menu, boot sequence, hash links, and responsive mobile windows
- Data-driven experience, training, project, profile, and contact content
- Multi-image project galleries and an embedded PDF resume
- Beginner, Intermediate, and Expert Minesweeper with chording and classic rules
- Keyboard navigation, visible focus states, reduced-motion support, and touch-friendly fallbacks

## Technology

- React
- TypeScript
- Vite
- CSS Modules
- Vitest and Testing Library

The interface is implemented without a UI framework, router, drag-and-drop package, window-manager library, or game library.

## Getting started

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Create and inspect a production build locally:

```bash
npm run build
npm run preview
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

## Project structure

```text
src/
├── app/                  application shell
├── components/
│   ├── desktop/          shortcuts and desktop interactions
│   ├── minesweeper/      game engine and interface
│   ├── portfolio/        portfolio applications
│   ├── start-menu/       Start menu and shutdown dialog
│   ├── taskbar/          taskbar and system tray
│   └── window/           window chrome and interactions
├── content/              typed portfolio content
├── state/window-manager/ window state and reducer
├── styles/               global tokens and controls
└── test/                 behavioral integration tests
```

## Updating portfolio content

Public-facing information is centralized in typed content files:

- Profile, education, and skills: `src/content/profile.ts`
- Experience and training: `src/content/experience.ts`
- Projects and gallery media: `src/content/projects.ts`
- Contact details: `src/content/contact.ts`
- Resume configuration: `src/content/resume.ts`

Project media belongs under `public/media/projects/`. Each project accepts multiple gallery entries with descriptive alternative text.

The public resume must be placed at:

```text
public/huseyin_tenlik_cv.pdf
```

## Attribution

The Minesweeper implementation and embedded pixel sprites are adapted from the MIT-licensed [AkshayKalose/Minesweeper-XP](https://github.com/AkshayKalose/Minesweeper-XP) project. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for license details.

All other interface illustrations, icons, wallpaper, and visual assets in this repository are original to htenlikOS.
