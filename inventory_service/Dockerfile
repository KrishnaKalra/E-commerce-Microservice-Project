FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy shared constants
COPY constants/ ./constants/

# Copy package files and install dependencies
COPY inventory_service/package*.json ./inventory_service/
WORKDIR /usr/src/app/inventory_service
RUN npm ci

# Copy service source code
COPY inventory_service/ ./

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files from builder stage
COPY --from=builder /usr/src/app /usr/src/app

WORKDIR /usr/src/app/inventory_service

EXPOSE 3008
CMD ["node", "src/app.js"]
