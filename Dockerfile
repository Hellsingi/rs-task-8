# Base layer
FROM node:14-alpine AS base
WORKDIR /usr/src/app

# Add package.json and package-lock.json, install development dependencies which will be used for build
FROM base AS dev-dependencies
COPY package*.json ./
RUN npm install \
    && npm cache clean --force

# Build app and delete development dependencies
FROM dev-dependencies AS build
WORKDIR /usr/src/app
COPY . .
RUN npm run build \
    && rm -r node_modules

# Set NODE_ENV, add package.json, install dependencies from production version, copy app build, set port and run app
FROM node:14-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY --from=dev-dependencies /usr/src/app/package.json ./
RUN npm install \
    && npm cache clean --force
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 4000
CMD [ "node", "dist/main.js" ]