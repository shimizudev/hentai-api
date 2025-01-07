# Use the official Bun image as the base image for building
FROM oven/bun:latest as builder

# Copy package.json and bun.lockb to the working directory
COPY package.json ./
COPY bun.lockb ./
# Copy the source code
COPY src ./

# Install dependencies
RUN bun install

# Use the official Node.js image as the base image for the final image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules
# Copy package.json and bun.lockb from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb ./bun.lockb
# Copy the source code from the builder stage
COPY --from=builder /app/src ./src

# Install mongodb
RUN apt-get update && apt-get install -y mongodb

# Install redis-server
RUN apt-get update && apt-get install -y redis-server

# Set environment variables
ENV NODE_ENV=production
ENV MONGODB_URL=mongodb://localhost:27017/hentai-api
ENV REDIS_HOST=localhost
# The Redis password is a required variable, but Redis server doesn't have a password enabled by default, so we're passing a dummy value.
ENV REDIS_PASSWORD=password

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["bun", "run", "start"]
