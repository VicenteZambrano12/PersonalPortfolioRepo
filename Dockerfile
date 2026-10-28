# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/. .

# Build-time env vars inlined into the static bundle by Vite
ARG VITE_PAUHELPER_LIVE_URL
ENV VITE_PAUHELPER_LIVE_URL=$VITE_PAUHELPER_LIVE_URL
ARG VITE_ORCHESTRATOR_APP
ENV VITE_ORCHESTRATOR_APP=$VITE_ORCHESTRATOR_APP
ARG VITE_HISTORIC_GUIDE_APP
ENV VITE_HISTORIC_GUIDE_APP=$VITE_HISTORIC_GUIDE_APP

RUN npm run build

# --- Authenticated serve stage ---
FROM node:22-alpine AS serve
WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev
COPY server/ ./server/
COPY auth-portal/ ./auth-portal/
COPY --from=build /app/dist ./frontend/dist

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

USER node
CMD ["node", "server/index.js"]
