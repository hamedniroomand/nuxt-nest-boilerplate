FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY ./shared ./shared/

WORKDIR /app/client
COPY ./client/package.json ./client/yarn.lock ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]