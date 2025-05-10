FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY ./server/package.json ./server/
COPY ./server/yarn.lock ./server/
COPY ./client/package.json ./client/
COPY ./client/yarn.lock ./client/
COPY ./shared ./shared/

RUN yarn install
RUN yarn install:dependencies

COPY ./server ./server
COPY ./client ./client

RUN yarn build

ENV PORT=3000
ENV NODE_ENV=production

RUN chown -R node:node /app/server/dist

USER node

EXPOSE 3000

CMD ["yarn", "start"]
