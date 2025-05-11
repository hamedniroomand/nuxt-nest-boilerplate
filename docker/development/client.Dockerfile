FROM node:20-alpine

RUN apk add pnpm

WORKDIR /app

COPY package.json ./
COPY ./shared ./shared/

WORKDIR /app/client
COPY ./client/package.json ./client/pnpm-lock.yaml ./

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "dev"]