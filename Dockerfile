# Promofy SBC Summit — static site + CSV RSVP collector.
# Build:   docker build -t promofy-sbc-rsvp .
# Run:     docker run -p 3000:3000 -v promofy-rsvp-data:/app/data promofy-sbc-rsvp

# ---- Build stage: bakes the RSVP endpoint into the static export ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Public vars are baked into the static bundle at build time.
ARG NEXT_PUBLIC_RSVP_FORM_ENDPOINT=/api/rsvp
ENV NEXT_PUBLIC_RSVP_FORM_ENDPOINT=$NEXT_PUBLIC_RSVP_FORM_ENDPOINT
RUN npm run build

# ---- Runtime stage: zero-dependency Node server ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0
COPY --from=build /app/out ./out
COPY --from=build /app/server ./server
# RSVPs are appended here; mount a persistent volume at /app/data.
RUN mkdir -p /app/data
VOLUME /app/data
EXPOSE 3000
CMD ["node", "server/rsvp-server.mjs"]
