FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY ./shared ./shared/

WORKDIR /app/server
COPY ./server/package.json ./server/yarn.lock ./

RUN yarn install

ENV PORT=3001

EXPOSE 3001

CMD ["yarn", "dev"]