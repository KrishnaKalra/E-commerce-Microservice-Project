FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY user-gateway/package*.json ./user-gateway/
WORKDIR /usr/src/app/user-gateway
RUN npm ci

# Copy service source code
COPY user-gateway/ ./

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files from builder stage
COPY --from=builder /usr/src/app /usr/src/app

WORKDIR /usr/src/app/user-gateway

EXPOSE 3000
CMD ["node", "src/app.js"]
