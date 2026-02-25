FROM node:20-slim AS base

# 1. Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 2. Prune the monorepo for the worker app
FROM base AS builder
RUN apt-get update && apt-get install -y libc6 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN pnpm add -g turbo@^2
COPY . .
RUN turbo prune worker --docker

# 3. Install dependencies
FROM base AS installer
RUN apt-get update && apt-get install -y libc6 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# First install dependencies (layer caching)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build --filter=worker...

# 4. Production runner
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs --create-home workerjs

# Pre-install wrangler globally
RUN npm install -g wrangler@latest

# Copy the entire pruned monorepo from the installer stage to preserve paths
COPY --from=installer --chown=workerjs:nodejs /app /app

# Final fix for permissions on the persisted state if needed
RUN mkdir -p /app/apps/worker/node_modules/.mf && chown -R workerjs:nodejs /app

USER workerjs
ENV HOME=/home/workerjs

# Move to the worker directory to run wrangler
WORKDIR /app/apps/worker

EXPOSE 8787
ENV PORT 8787
ENV NODE_ENV development

# Run wrangler in local mode
CMD ["wrangler", "dev", "--ip", "0.0.0.0", "--port", "8787", "--local"]
