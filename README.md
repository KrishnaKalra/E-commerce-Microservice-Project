# 🛒 Cloud-Native E-Commerce Event-Driven Microservices Platform

An enterprise-grade, event-driven e-commerce platform built with **Node.js**, **Express**, **Apache Kafka (KRaft)**, **PostgreSQL 15**, **Redis 7**, **BullMQ**, and **Prisma ORM**. Containerized with **Docker Compose** and optimized for single-node low-memory cloud deployment (e.g., AWS Free Tier EC2).

---

## 🏗️ Architecture Overview

The platform uses a **Choreographed Saga Pattern**, an **API Gateway Pattern**, and a **Database-per-Service Pattern**:

```
                              [ Public Internet ]
                                       │
                                (Port 3000 Only)
                                       ▼
                             ┌───────────────────┐
                             │   user-gateway    │
                             └─────────┬─────────┘
                                       │  (Internal Docker Network)
         ┌──────────────┬──────────────┼──────────────┬──────────────┐
         ▼              ▼              ▼              ▼              ▼
   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
   │   auth-   │  │ product-  │  │  order-   │  │inventory- │  │ payment-  │
   │  service  │  │  service  │  │  service  │  │  service  │  │  service  │
   └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
         │              │              │              │              │
         └──────────────┴──────────────┼──────────────┴──────────────┘
                                       ▼
                           ┌───────────────────────┐
                           │   Apache Kafka 3.7    │
                           │      (KRaft Bus)      │
                           └───────────┬───────────┘
                                       ▼
                               ┌───────────────┐
                               │ email-service │ ──► [ Redis / BullMQ ] ──► [ SMTP ]
                               └───────────────┘
```

### 🌟 Key Technical Highlights

1. **Zero-Trust Asymmetric Authentication (RS256)**:
   - `auth-service` signs JWTs with a private key (`private.pem`).
   - Downstream services and `user-gateway` verify signatures with `public.pem`.
   - **Blast-Radius Defense**: If an attacker compromises `product-service` or `user-gateway`, they only obtain `public.pem` and cannot forge tokens or compromise user identity.
2. **Event-Driven Choreographed Saga (Apache Kafka)**:
   - 9 business events across decoupled topics (`order-created`, `inventory-reserved`, `payment-verified`, `order-confirmed`, etc.).
   - Asynchronous event flow with automated compensations on failure (`inventory-reservation-failed`, `payment-failed`, `order-failed`).
3. **Anti-Overselling Inventory Reservation**:
   - Two-phase inventory locking: stock is placed in an `InventoryReservation` record with a `PENDING` status and expiration timestamp.
   - Eliminates race conditions during concurrent flash sales.
4. **Automated Cron Reconciler (`node-cron`)**:
   - Runs every 5 minutes (`*/5 * * * *`) in `inventory-service`.
   - Automatically detects abandoned orders/reservations (`expiresAt < now`), releases locked stock, marks reservations `EXPIRED`, and emits `inventory-reservation-failed` to cancel the order.
5. **Decoupled Asynchronous Email Processing (BullMQ + Redis)**:
   - Kafka events push jobs into a Redis-backed BullMQ queue.
   - Dedicated worker pool (concurrency: 5) sends transactional emails via Nodemailer without blocking Kafka consumption or HTTP request threads.
6. **Strict Network Isolation**:
   - Only `user-gateway` (Port 3000) is accessible publicly.
   - All 6 microservices, PostgreSQL (`5432`), Redis (`6379`), and Kafka (`9092`) have no published host ports and communicate via Docker internal DNS.
7. **Ultra-Low Memory Footprint (AWS Free Tier Ready)**:
   - Pre-tuned with JVM heap caps (`-Xmx256m`), PostgreSQL shared buffers (`64MB`), Redis maxmemory (`64mb`), and V8 old-space limits (`128MB`).
   - Runs all **10 containers stably within ~250 MiB of active RAM** on a 1 GiB `t2.micro` instance.

---

## 📦 Services & Ports

| Service | Container Port | Public? | Database | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`user-gateway`** | `3000` | ✅ Yes | None | Single entry point, reverse proxy, public-key JWT verification |
| **`auth-service`** | `3005` | ❌ Internal | `mydb` | Registration, login, password hashing (bcrypt), RS256 token signing |
| **`product-service`** | `3006` | ❌ Internal | `product` | Catalog CRUD, Zod validation, soft-delete, ownership verification |
| **`order-service`** | `3007` | ❌ Internal | `order` | Order state machine, Saga choreography |
| **`inventory-service`**| `3008` | ❌ Internal | `inventory` | Stock management, 2-phase reservations, 5-min cleanup cron job |
| **`payment-service`** | `3009` | ❌ Internal | In-Memory | Payment simulation, verification event emitter |
| **`email-service`** | Worker | ❌ Internal | Redis | BullMQ queue worker, transactional emails via Nodemailer |
| **`postgres`** | `5432` | ❌ Internal | Multi-tenant | PostgreSQL 15 relational store (isolated schemas) |
| **`redis`** | `6379` | ❌ Internal | In-Memory | Redis 7 cache & BullMQ queue backend |
| **`kafka`** | `9092` | ❌ Internal | Disk (KRaft) | Distributed message broker (event streaming) |

---

## ⚡ Kafka Event Directory

| Event Name | Kafka Topic | Emitter | Consumer(s) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `USER_CREATED` | `user-created` | `auth-service` | `email-service` | Welcome email trigger |
| `PRODUCT_CREATED` | `product-created` | `product-service` | `inventory-service` | Initial inventory creation |
| `ORDER_CREATED` | `order-created` | `order-service` | `inventory-service` | Triggers stock reservation check |
| `INVENTORY_RESERVED` | `inventory-reserved` | `inventory-service` | `payment-service`, `order-service` | Stock locked; triggers payment |
| `RESERVATION_FAILED` | `inventory-reservation-failed` | `inventory-service` | `order-service` | Insufficient stock or expired TTL |
| `PAYMENT_VERIFIED` | `payment-verified` | `payment-service` | `order-service` | Payment confirmed |
| `PAYMENT_FAILED` | `payment-failed` | `payment-service` | `order-service`, `email-service` | Payment rejected; order failed email |
| `ORDER_CONFIRMED` | `order-confirmed` | `order-service` | `email-service` | Order finalized; confirmation email |
| `ORDER_FAILED` | `order-failed` | `order-service` | `email-service` | Order aborted |

---

## 🚀 Quickstart: Running Locally with Docker

### 1. Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose v2](https://docs.docker.com/compose/)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/KrishnaKalra/E-commerce-Microservice-Project.git
cd E-commerce-Microservice-Project
```

### 3. Configure Environment Variables
Create a root `.env` file for secrets:
```bash
cat > .env << 'EOF'
GOOGLE_APP_PASSWORD=your_16_char_google_app_password
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
EOF
```

### 4. RSA Key Pair Setup
Ensure RSA keys exist in `keys/` directories for services. To generate fresh keys:
```bash
# Generate private key
openssl genrsa -out private.pem 2048

# Extract public key
openssl rsa -in private.pem -pubout -out public.pem

# Copy keys to services
for svc in auth_service product_service order_service inventory_service payment_service user-gateway; do
  mkdir -p $svc/keys
  cp public.pem $svc/keys/public.pem
  cp private.pem $svc/keys/private.pem
done
```

### 5. Build and Start the Stack
```bash
docker compose up -d
```

### 6. Run Database Migrations (First Run Only)
Wait ~15 seconds for PostgreSQL and Kafka to report `healthy`, then apply Prisma migrations:
```bash
docker compose exec auth-service npx prisma migrate deploy
docker compose exec product-service npx prisma migrate deploy
docker compose exec order-service npx prisma migrate deploy
docker compose exec inventory-service npx prisma migrate deploy
```

### 7. Verify All Containers Are Up
```bash
docker compose ps
docker stats --no-stream
```
All 10 containers should be running with combined RAM usage around ~200–250 MiB.

---

## ☁️ Deployment on AWS Free Tier (EC2)

### 1. Launch EC2 Instance
- **AMI**: Ubuntu 24.04 LTS (x86_64)
- **Instance Type**: `t2.micro` or `t3.micro` (1 vCPU, 1 GiB RAM)
- **Storage**: 30 GiB gp3 (covered by Free Tier)
- **Security Group Inbound Rules**:
  - `SSH` (Port 22) $\rightarrow$ `My IP`
  - `Custom TCP` (Port 3000) $\rightarrow$ `0.0.0.0/0` (Public API Ingress)

### 2. Configure Linux Virtual Swap (Crucial on 1 GiB RAM)
SSH into the instance and configure 4 GiB swap:
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### 3. Install Docker
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
```

### 4. Deploy & Run
```bash
git clone https://github.com/KrishnaKalra/E-commerce-Microservice-Project.git
cd E-commerce-Microservice-Project

# Copy private.pem to EC2 via scp, create .env, then:
docker compose up -d

# Run Prisma migrations once containers are healthy
docker compose exec auth-service npx prisma migrate deploy
docker compose exec product-service npx prisma migrate deploy
docker compose exec order-service npx prisma migrate deploy
docker compose exec inventory-service npx prisma migrate deploy
```

---

## 📡 API Endpoints Reference

All requests pass through the **User Gateway** on port `3000` (e.g. `http://localhost:3000` or `http://<EC2_PUBLIC_IP>:3000`).

### Authentication (`/`)
- `POST /sign-up` — Register a new user
  ```json
  { "name": "John Doe", "email": "john@example.com", "password": "password123" }
  ```
- `POST /log-in` — Authenticate and receive RS256 JWT
  ```json
  { "email": "john@example.com", "password": "password123" }
  ```
  *Response:* `{ "success": true, "token": "ey..." }`

### Products (`/product`) *(Requires `Authorization: Bearer <token>`)*
- `GET /product` — List products (query params: `page`, `limit`)
- `GET /product/:id` — Get product by ID
- `POST /product` — Create a product
  ```json
  { "name": "Wireless Mouse", "description": "Ergonomic 2.4G", "price": 29.99 }
  ```
- `PATCH /product/:id` — Update product (creator only)
- `DELETE /product/:id` — Soft delete product (creator only)

### Inventory (`/inventory`) *(Requires `Authorization: Bearer <token>`)*
- `GET /inventory/:productId` — Check stock & reserved count
- `POST /inventory` — Create product inventory stock
  ```json
  { "productId": "uuid-here", "stock": 100 }
  ```
- `PATCH /inventory/:productId/stock` — Update stock level

### Orders (`/order`) *(Requires `Authorization: Bearer <token>`)*
- `GET /order` — List authenticated user's orders
- `GET /order/:id` — Get order details by ID
- `POST /order` — Place an order (triggers Kafka Saga)
  ```json
  { "productId": "uuid-here", "amount": 29.99, "quantity": 1, "paymentId": "pay_test_123" }
  ```

---

## 🛡️ Security & Access Control

- **Ownership-Based Access**: Users can only update or delete products they created (`where: { id, createdBy: user.id }`).
- **Order Isolation**: Users can only inspect their own orders (`where: { createdBy: user.id }`).
- **Internal Microservice Defense**: Internal services reject any request missing a valid RS256 token verified against `public.pem`.
- **Infrastructure Isolation**: Databases, Redis, and Kafka do not bind to `0.0.0.0` on the host, preventing external port scanning.

---

## 🛑 Stopping the Stack

```bash
# Stop containers (preserves database volumes)
docker compose stop

# Stop and remove containers + networks
docker compose down

# Stop and wipe database volumes (destructive clean start)
docker compose down -v
```

