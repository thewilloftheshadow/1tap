FROM node:22-alpine AS base
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1

RUN npm i -g bun

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

FROM base AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

# Create an empty database file for build process
RUN mkdir -p data && touch data/app.db
RUN touch local.db

RUN bun run build

FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts

FROM base AS runtime
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/postcss.config.cjs ./postcss.config.cjs
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

RUN mkdir -p /app/uploads
RUN mkdir -p /app/data

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["sh", "-c", "bun run db:push && bun start"]
