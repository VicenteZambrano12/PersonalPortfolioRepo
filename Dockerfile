# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/. .
RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine AS serve

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run injects PORT; nginx templating renders it into the listen directive
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
