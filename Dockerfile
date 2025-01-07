FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install

FROM node:20

WORKDIR /app

COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/package.json ./package.json
COPY --from=0 /app/bun.lockb ./bun.lockb
COPY --from=0 /app/src ./src

RUN apt-get update && apt-get install -y mongodb

RUN apt-get update && apt-get install -y redis-server

ENV NODE_ENV=production
ENV MONGODB_URL=mongodb://localhost:27017/hentai-api
ENV REDIS_HOST=localhost
ENV REDIS_PASSWORD=password

EXPOSE 3000

CMD ["bun", "run", "start"]
