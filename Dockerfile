FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --production --frozen-lockfile --link-duplicates

COPY --chown=node:node . .
RUN yarn build

# ---

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["yarn", "prod"]