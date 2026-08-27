# Multi-stage Dockerfile for 100% Pure TypeScript PECOMED CAP CDSS
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root and frontend dependencies
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install && cd frontend && npm install

# Copy source files
COPY . .

# Build frontend and server
RUN npm run build

# Production Runner stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/main/resources/static ./src/main/resources/static

# Run as non-root user for security
USER node

EXPOSE 8080

CMD ["node", "dist/server.js"]
