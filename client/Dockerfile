FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install 

RUN yarn global add vite

COPY . .