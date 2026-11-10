FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy shared constants
COPY constants/ ./constants/

# Copy package files and install dependencies
COPY email_service/package*.json ./email_service/
WORKDIR /usr/src/app/email_service
RUN npm ci

# Copy service source code
COPY email_service/ ./

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files from builder stage
COPY --from=builder /usr/src/app /usr/src/app

WORKDIR /usr/src/app/email_service

CMD ["node", "src/app.js"]
