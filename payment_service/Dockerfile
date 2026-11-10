FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy shared constants
COPY constants/ ./constants/

# Copy package files and install dependencies
COPY payment_service/package*.json ./payment_service/
WORKDIR /usr/src/app/payment_service
RUN npm ci

# Copy service source code
COPY payment_service/ ./

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files from builder stage
COPY --from=builder /usr/src/app /usr/src/app

WORKDIR /usr/src/app/payment_service

EXPOSE 3009
CMD ["node", "src/app.js"]
