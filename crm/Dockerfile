FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# [optional] tests & build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN bunx --bun vite build

# run the app
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/
COPY --from=prerelease /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
ENV PORT 80