FROM node:20-alpine

WORKDIR /app

RUN mkdir -p /app/server && mkdir -p /app/client

COPY ./package.json /app/package.json
COPY ./server/package.json /app/server/package.json
COPY ./server/yarn.lock /app/server/yarn.lock
COPY ./client/package.json /app/client/package.json
COPY ./client/yarn.lock /app/client/yarn.lock

RUN yarn install --prefix /app/server
RUN yarn install --prefix /app/client

COPY ./server /app/server
COPY ./client /app/client
COPY ./shared /app/shared

ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]
