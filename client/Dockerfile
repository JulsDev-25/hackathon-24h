FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --network-timeout 600000

COPY . .