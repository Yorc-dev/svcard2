FROM node:23.10.0-alpine AS builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN if [ "$NODE_ENV" = "development" ]; then npm run build:dev; else npm run build; fi 


FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
ENV PORT 80