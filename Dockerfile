FROM node:22-alpine
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1

RUN npm i -g bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN mkdir -p data && touch data/app.db
RUN bun run build
RUN mkdir -p uploads
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["sh", "-c", "bun run db:push && bun start"]
