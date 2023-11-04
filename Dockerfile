# cspell:disable
FROM node:18

WORKDIR /app

COPY yarn.lock package.json ./

# Install all dependencies
RUN yarn install --frozen-lockfile

ENV NODE_ENV production
ENV PORT 8080

COPY . .

RUN yarn build

# Install again to remove devDependencies because NODE_ENV is set to production
RUN yarn install --frozen-lockfile

EXPOSE 8080
ENTRYPOINT [ "yarn", "start" ]
