FROM node:16-alpine AS dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.13.2-alpine3.15 as production

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist


ARG PORT=8080
EXPOSE $PORT
ENV PORT $PORT

CMD ["node", "dist/main"]