# React + Vite

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
