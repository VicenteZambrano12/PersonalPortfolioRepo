# React + Vite

## Running in GitHub Codespaces

From `frontend/`, run `npm ci` on first setup, then `npm run dev`.
In the Codespaces **Ports** tab, open port **5173** in your browser and keep its
visibility **Private**. Keep the development command running while using the app.

Vite listens on all IPv4 interfaces and allows the current Codespace's forwarded
hostname using `CODESPACE_NAME` and `GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN`.
Port 5173 is fixed: if it is already occupied, stop the other server before
starting a new one. Other external hostnames remain blocked.

## Authentication

Production serves this build through a
[Firebase session-verifying Node server](../server/app.js), not a public static
server. All portfolio routes and assets require login; the header posts sign-out
to `/auth/logout`. The same-origin [login page](../auth-portal/index.html) uses
administrator-created email/password accounts with public signup disabled.

See the [deployment and local authentication instructions](../infra/README.md).
`npm run dev` and `npm run preview` are frontend-only development servers; they do
not enforce authentication or implement the logout endpoint. Use the Node server
with a built frontend to test authentication. Never expose Vite or the static
build directly as the protected production app.

## Brand and interface

Both themes follow the robot logo: midnight navy surfaces, cyan highlights,
electric blue, and violet actions. Light mode uses deeper cyan and violet for
readable text rather than placing neon colors on white.
The shared palette lives in [colors.jsx](src/utils/colors.jsx); keep the CSS
interaction tokens in [index.css](src/index.css) and the standalone
[sign-in page](../auth-portal/index.html) aligned when changing it.
Only the logo at `/auth/brand/logo.png` is public for sign-in branding; portfolio
pages and other assets remain protected.

Project cards support Enter and Space. Dialogs contain keyboard focus, close on
Escape, and return focus to their trigger. Presentations inherit the active theme
through their `theme` query parameter; standalone decks use the saved or system
preference. Reduced-motion preferences disable UI transitions and slide animation.
The portfolio video button sits alongside the presentation buttons. It is marked
as coming soon and disabled until the portfolio video is ready.

## Project demos

The **Open Live App** action always appears in project details. It opens the
configured URL in a new tab. If no URL is configured, the button is disabled and
an explanation is shown instead of hiding the action or linking to `#`.

PAUHelper uses `VITE_PAUHELPER_LIVE_URL`; Orchestrator uses
`VITE_ORCHESTRATOR_APP`. For local development, set these in the repository-root
`.env` (Vite uses `envDir: '..'`) or in the process environment, then restart
Vite. Copy the repository-root [.env.sample](../.env.sample) to `.env` to get
started; it also includes `VITE_QDRANT_VM_STARTER_URL` for the Qdrant VM starter.
These values are public frontend configuration, so do not include secrets.
Production receives them as Docker build arguments; changes require a rebuild.
Voice Simulator does not currently have a demo URL configured.

## YouTube card

The portfolio shows the latest three regular uploads from the configured channel
([channel URL](src/lib/youtube.js)), with their thumbnails, original titles and watch links.
Thumbnails load from YouTube's image CDN and share the same link as the title.
Click the YouTube card to open them in a popup styled like the project modals.
The popup loads the list when opened and closes with its close button, Escape,
or a click on the backdrop. Keyboard focus stays inside and returns to the card
when closed.
Shorts are excluded by reading only watch entries from the channel's Videos tab,
not its uploads feed or Shorts tab. No API key or browser-side YouTube data request is needed.

`npm run dev` and `npm run build` first run `npm run refresh:youtube`, which writes
an ignored `public/youtube-videos.json` file served with the app. This also runs
during the Docker build. Videos update on each build/deploy, not continuously
between deployments. You can run the refresh command manually during development.

Refresh requires network access to YouTube. HTTP errors, fewer than three valid
videos, or an unrecognized page format fail the command/build explicitly, rather
than shipping stale data. If YouTube changes its page format, update
[the extraction helper](scripts/youtube.mjs). A failed browser request displays a
localized error with a channel link.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
