FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY ./server/package.json ./server/
COPY ./server/yarn.lock ./server/
COPY ./client/package.json ./client/
COPY ./client/yarn.lock ./client/
COPY ./shared ./shared/

RUN yarn install:dependencies

COPY ./server ./server
COPY ./client ./client

RUN yarn build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/server/dist ./server/dist

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server/dist/server/src/main.js"]
