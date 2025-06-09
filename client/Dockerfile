FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --network-timeout 600000

RUN yarn global add vite

COPY . .