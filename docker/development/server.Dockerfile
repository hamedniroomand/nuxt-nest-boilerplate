FROM node:20-alpine

RUN apk add pnpm

WORKDIR /app

COPY package.json ./
COPY ./shared ./shared/

WORKDIR /app/server
COPY ./server/package.json ./server/pnpm-lock.yaml ./

RUN pnpm install

ENV PORT=3001

EXPOSE 3001

CMD ["pnpm", "dev"]