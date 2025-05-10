FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY shared ./shared

WORKDIR /app/client
COPY client/package.json client/yarn.lock ./
RUN yarn install

WORKDIR /app/server
COPY server/package.json server/yarn.lock ./
RUN yarn install

WORKDIR /app

COPY client ./client
COPY server ./server

RUN yarn build:client
RUN yarn build:server

RUN mkdir -p server/dist/client && \
    cp -r client/.output/* server/dist/client/

FROM node:20-alpine AS production

WORKDIR /app

COPY package.json ./
COPY server/package.json ./server/

WORKDIR /app/server
RUN yarn install

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/client/.output/public ./dist/client/public

ENV PORT=3000
ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD ["node", "dist/server/src/main.js"]