# htenlikOS

htenlikOS is [Hüseyin Tenlik's](https://htenlik.com) production portfolio: an original early-2000s desktop-inspired interface for engineering experience, public project case studies, and a playable Minesweeper easter egg.

The visual system borrows the language of classic desktop software—blue title bars, beveled controls, a taskbar, file explorers, and a rolling-hills wallpaper—without copying Microsoft artwork, logos, sounds, icons, or proprietary UI assets. Every illustration and SVG in this repository is original.

## Screenshots

The repository includes the original visual assets used by the application:

- [Desktop wallpaper](public/wallpapers/htenlik-hills.svg)
- [Jotform analytics sanitized concept](public/media/projects/jotform/jotform-analytics-preview.svg)
- [Internship workflow conceptual preview](public/media/projects/internship-workflow/internship-workflow-preview.svg)
- [Taşınmaz sanitized concept](public/media/projects/tasinmaz/tasinmaz-preview.svg)
- [MPI torus topology diagram](public/media/projects/mpi-torus/mpi-torus-preview.svg)

## Features

- Session-only, skippable htenlikOS boot sequence with reduced-motion support
- Keyboard- and pointer-operable desktop shortcuts
- Custom window manager with open, focus, overlap, drag, minimize, restore, maximize, close, and taskbar behavior
- Responsive full-screen application panels on mobile
- Start menu, safe “Shut Down” dialog, live local clock, and date tooltip
- Shareable hashes for applications and project details, including `#about`, `#projects`, and `#project/tasinmaz-management-system`
- Data-driven profile, experience, contact, and project case studies
- Complete 9×9 Minesweeper with delayed mine placement, first-click safety, flags, flood reveal, timer, keyboard/touch controls, and deterministic engine tests
- Persistent `secret.txt` unlock after the first Minesweeper victory
- Missing-resume and failed-image fallbacks, storage guards, and a React error boundary
- Indexable metadata, canonical URL, Open Graph/Twitter cards, manifest, robots file, and sitemap

## Architecture

The application uses React, Vite, strict TypeScript, CSS Modules, and a small set of global retro design tokens. It intentionally has no router, UI framework, drag library, window-manager package, or game package.

```text
src/
├── app/                  application shell and error boundary
├── components/
│   ├── boot/             session boot experience
│   ├── desktop/          shortcuts and selection behavior
│   ├── dialogs/          modal system feedback
│   ├── minesweeper/      game engine, UI, and engine tests
│   ├── portfolio/        About, Experience, Projects, Resume, Contact
│   ├── start-menu/       Start menu and shutdown dialog
│   ├── taskbar/          open-window controls and live clock
│   └── window/           draggable application window frame
├── content/              typed public portfolio content
├── hooks/                viewport, media-query, and hash integration
├── state/window-manager/ context, registry, reducer, and tests
├── styles/               global tokens and classic controls
├── test/                 integration behavior tests
└── types/                shared window contracts
```

### Window manager

`WindowManagerProvider` owns a typed reducer. The central registry supplies each single-instance window's title, icon, initial position, dimensions, and minimum size. Reducer actions open, focus, move, minimize, restore, maximize, and close windows while maintaining z-order. Pointer events implement drag behavior; rendering clamps dimensions and positions whenever the viewport changes. At 640 px and below, windows become full-screen panels above the taskbar and dragging is disabled.

Hashes map directly to registry IDs without a routing dependency. Supported examples include:

```text
#about
#experience
#projects
#project/jotform-sign-analytics
#project/internship-workflow-management
#project/tasinmaz-management-system
#project/mpi-gather-torus
#resume
#contact
#minesweeper
```

### Minesweeper engine

The engine in `src/components/minesweeper/engine.ts` is independent from React. Mines are placed only after the first reveal, excluding the first cell and its neighbors whenever board capacity allows. The engine owns adjacency calculation, recursive empty-region reveal, flags, loss disclosure, incorrect-flag marking, and win detection. A random-number source can be injected for deterministic tests. React owns only presentation, elapsed time, announcements, and the persistent win unlock.

## Editing portfolio content

- Profile, summary, education, and technology groups: `src/content/profile.ts`
- Work experience: `src/content/experience.ts`
- Project facts, links, media, and case-study sections: `src/content/projects.ts`
- Public contact links: `src/content/contact.ts`
- Resume availability: `src/content/resume.ts`

Content files are intentionally separate from components. Keep claims conservative and public. Never add internal endpoints, private company code, customer data, tokens, private screenshots, or inferred contact details.

### Adding project media

Place reviewed, sanitized files in the matching directory:

```text
public/media/projects/jotform/
public/media/projects/internship-workflow/
public/media/projects/tasinmaz/
public/media/projects/mpi-torus/
```

Then add a `ProjectMedia` entry in `src/content/projects.ts`. Use an accurate `alt` description and set `kind` to `concept`, `sanitized`, or `diagram`. Never commit confidential screenshots or remote image hotlinks.

### Adding the resume

The public PDF is intentionally absent until a reviewed file is available.

1. Add it at `public/Huseyin-Tenlik-CV.pdf`.
2. Set `resumeFile` in `src/content/resume.ts` to `'/Huseyin-Tenlik-CV.pdf'`.
3. Rebuild and confirm View, Download, embedded preview, and fallback behavior.

Do not replace it with a generated or placeholder PDF.

## Local development

Requirements: a current Node.js release supported by Vite and npm.

```bash
npm ci
npm run dev
```

Vite prints the local URL. Hash deep links work in development and in the Cloudflare SPA fallback.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

For watch-mode tests, run `npm test`. To inspect the production build locally:

```bash
npm run preview
```

Tests cover the window reducer, Minesweeper engine, desktop opening, Start menu dismissal, taskbar restore, persisted secret visibility, and missing-resume fallback. Responsive behavior is designed and verified at 320, 375, 768, 1024, and 1440 px.

## Production build and Cloudflare Workers

The deployment uses Cloudflare Workers Static Assets. `wrangler.jsonc` defines:

- Worker name: `portfolio`
- Static assets directory: `./dist`
- SPA fallback: `single-page-application`
- Compatibility date: `2026-07-19`
- No Worker script, bindings, routes, secrets, or DNS configuration

Manual deployment after authentication:

```bash
npm ci
npm run build
npx wrangler deploy
```

The equivalent package command is `npm run deploy`.

### Required Cloudflare dashboard update before merge

The current production configuration serves the legacy `public` directory. Before merging this feature branch, update the connected Cloudflare Workers build configuration to exactly:

| Setting | Value |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Remove or replace the old static-public/`public` output configuration so Cloudflare deploys the Vite-generated `dist` directory through `wrangler.jsonc`. Keep the existing custom domain managed in the Cloudflare dashboard. Do not change DNS records. This feature branch must not be attached to or deployed over the production custom domain before review and merge.

## Accessibility

The interface uses semantic buttons and links, strong visible focus indicators, keyboard-operable shortcuts and game cells, text alternatives for informative media, `aria-live` game/copy feedback, Escape dismissal for menus and dialogs, and a reduced-motion mode. Mobile controls remain available without hover or right-click. Color is supplemented with labels, symbols, and state text.

## Privacy and confidentiality

The Jotform case study contains only generalized contributions from the approved brief and an original mock-data SVG. It exposes no source code, internal paths, product data, customer identifiers, emails, or screenshots. Email and LinkedIn are not published because no explicitly public values were found in this repository. Project repositories are linked only where public URLs were verified.

## Status and Git workflow

Development happens on `feature/retro-portfolio`. The production `main` branch retains the Under Construction site until this branch is reviewed and intentionally merged. Do not force-push or deploy the feature branch to the production custom domain.

Milestones are committed independently. For follow-up work, branch from the intended base, run all four quality commands, review the built `dist` tree, and open a pull request rather than merging locally into `main`.
