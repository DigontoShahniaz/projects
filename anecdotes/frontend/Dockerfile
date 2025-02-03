# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.13.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Vite"

WORKDIR /app

ENV NODE_ENV="production"

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package-lock.json package.json ./  
RUN npm ci --include=dev  

COPY . .  

RUN npm run build  

RUN npm prune --omit=dev  

# Install JSON Server globally
RUN npm install -g json-server  

# Copy database file
COPY db.json /app/db.json

# Final stage
FROM nginx

# Install Supervisor to manage multiple processes
RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 80 3001

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
