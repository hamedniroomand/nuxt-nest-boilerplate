FROM node:20-alpine AS builder

RUN apk add pnpm

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

COPY shared ./shared

WORKDIR /app/client
COPY client/package.json client/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production

WORKDIR /app/server
COPY server/package.json server/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

WORKDIR /app

COPY client ./client
COPY server ./server

RUN pnpm build:client
RUN pnpm build:server

RUN mkdir -p server/dist/client && \
    cp -r client/.output/* server/dist/client/

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/.output ./server/dist/client/

ENV PORT=3000
ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD ["node", "server/dist/server/src/main.js"]