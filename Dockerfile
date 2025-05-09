FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY ./server/package.json ./server/
COPY ./server/yarn.lock ./server/
COPY ./client/package.json ./client/
COPY ./client/yarn.lock ./client/
COPY ./shared ./shared/

RUN cd server && yarn install
RUN cd client && yarn install

COPY ./server ./server
COPY ./client ./client

RUN yarn build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/package.json ./

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/public ./client/public
COPY --from=builder /app/shared ./shared

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server/dist/server/src/main.js"]
