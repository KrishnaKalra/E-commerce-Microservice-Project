FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy shared constants
COPY constants/ ./constants/

# Copy package files and install dependencies
COPY auth_service/package*.json ./auth_service/
WORKDIR /usr/src/app/auth_service
RUN npm ci

# Copy service source code
COPY auth_service/ ./

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files from builder stage
COPY --from=builder /usr/src/app /usr/src/app

WORKDIR /usr/src/app/auth_service

EXPOSE 3005
CMD ["node", "src/app.js"]
