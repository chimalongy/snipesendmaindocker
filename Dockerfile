# -------- Base image --------
FROM node:18-alpine AS base

# -------- Install dependencies --------
FROM base AS deps
WORKDIR /app

# Copy only package files first (better caching)
COPY package.json package-lock.json* ./

# Install dependencies (include dev for building)
RUN npm ci

# -------- Build the app --------
FROM base AS builder
WORKDIR /app

# Pass public env vars (used at build time by Next.js)
ARG NEXT_PUBLIC_TASKS_SCHEDULER_WORKER
ENV NEXT_PUBLIC_TASKS_SCHEDULER_WORKER=$NEXT_PUBLIC_TASKS_SCHEDULER_WORKER

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy rest of the source code
COPY . .

# Build Next.js in standalone mode
RUN npm run build

# -------- Production image --------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Run as non-root user
USER node

# Expose port
EXPOSE 3000

# ✅ Start Next.js standalone server
CMD ["node", "server.js"]
