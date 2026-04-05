# Finance Data Processing and Access Control Backend

A production-quality REST API for managing financial records with role-based access control, built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Seeding the Database](#seeding-the-database)
- [Access Control Matrix](#access-control-matrix)
- [API Reference](#api-reference)
- [Example Requests](#example-requests)
- [Design Decisions & Assumptions](#design-decisions--assumptions)

---

## Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Runtime        | Node.js (v18+)                    |
| Framework      | Express 4                         |
| Database       | MongoDB + Mongoose                |
| Authentication | JWT (jsonwebtoken)                |
| Validation     | express-validator                 |
| Password Hash  | bcryptjs                          |
| Logging        | morgan (dev only)                 |

---

## Project Structure

```
finance-backend/
├── src/
│   ├── app.js                  # Entry point: Express setup, middleware, routes
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── constants.js        # Enums: roles, types, statuses
│   ├── controllers/            # Request handlers (thin — delegate to services)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── record.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── rbac.js             # Role-based access control
│   │   ├── validate.js         # express-validator error collector
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/
│   │   ├── User.js             # User schema with password hashing
│   │   └── FinancialRecord.js  # Financial record schema with soft delete
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── record.routes.js
│   │   └── dashboard.routes.js
│   ├── services/               # Business logic (pure, testable, DB-aware)
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── record.service.js
│   │   └── dashboard.service.js
│   └── utils/
│       ├── AppError.js         # Custom operational error class
│       ├── catchAsync.js       # Async error wrapper (eliminates try/catch)
│       └── apiResponse.js      # Standardized success response helpers
├── scripts/
│   └── seed.js                 # Populates DB with test users + records
├── .env.example
├── .gitignore
└── package.json
```

---

## Setup & Installation

**Prerequisites:** Node.js v18+, MongoDB running locally or a MongoDB Atlas URI.

```bash
# 1. Clone / enter project directory
cd finance-backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET
```

---

## Environment Variables

| Variable        | Required | Default       | Description                         |
| --------------- | -------- | ------------- | ----------------------------------- |
| `PORT`          | No       | `5001`        | Port the server listens on          |
| `MONGODB_URI`   | Yes      | —             | MongoDB connection string           |
| `JWT_SECRET`    | Yes      | —             | Secret key for signing JWTs         |
| `JWT_EXPIRES_IN`| No       | `7d`          | JWT expiry duration                 |
| `NODE_ENV`      | No       | `development` | `development` or `production`       |

---

## Running the Server

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

Health check endpoint: `GET /health`

---

## Seeding the Database

```bash
npm run seed
```

Creates 3 users and 40 random financial records.

**Seeded credentials:**

| Role     | Email                  | Password      |
| -------- | ---------------------- | ------------- |
| admin    | admin@finance.com      | password123   |
| analyst  | analyst@finance.com    | password123   |
| viewer   | viewer@finance.com     | password123   |

---

## Access Control Matrix

| Endpoint                   | Viewer | Analyst | Admin |
| -------------------------- | :----: | :-----: | :---: |
| `POST /auth/register`      | ✅     | ✅      | ✅    |
| `POST /auth/login`         | ✅     | ✅      | ✅    |
| `GET /auth/me`             | ✅     | ✅      | ✅    |
| `GET /dashboard/summary`   | ✅     | ✅      | ✅    |
| `GET /records`             | ❌     | ✅      | ✅    |
| `POST /records`            | ❌     | ❌      | ✅    |
| `PATCH /records/:id`       | ❌     | ❌      | ✅    |
| `DELETE /records/:id`      | ❌     | ❌      | ✅    |
| `GET /users`               | ❌     | ❌      | ✅    |
| `PATCH /users/:id`         | ❌     | ❌      | ✅    |

---

## API Reference

All routes are prefixed with `/api/v1`.

### Auth

| Method | Route            | Description           | Auth |
| ------ | ---------------- | --------------------- | ---- |
| POST   | `/auth/register` | Register a new user   | No   |
| POST   | `/auth/login`    | Login, receive JWT    | No   |
| GET    | `/auth/me`       | Get logged-in profile | Yes  |

### Users (Admin only)

| Method | Route         | Description                  | Auth  |
| ------ | ------------- | ---------------------------- | ----- |
| GET    | `/users`      | List users (paginated)       | Admin |
| PATCH  | `/users/:id`  | Update user role or status   | Admin |

**Query params for `GET /users`:** `page`, `limit`, `role`, `status`, `search`

### Financial Records

| Method | Route           | Description                 | Auth            |
| ------ | --------------- | --------------------------- | --------------- |
| POST   | `/records`      | Create a record             | Admin           |
| GET    | `/records`      | List records (paginated)    | Analyst, Admin  |
| PATCH  | `/records/:id`  | Update a record             | Admin           |
| DELETE | `/records/:id`  | Soft-delete a record        | Admin           |

**Query params for `GET /records`:** `page`, `limit`, `type`, `category`, `startDate`, `endDate`, `search`

### Dashboard

| Method | Route                | Description              | Auth                     |
| ------ | -------------------- | ------------------------ | ------------------------ |
| GET    | `/dashboard/summary` | Full dashboard metrics   | Viewer, Analyst, Admin   |

**Dashboard response includes:**
- `totalIncome` — sum of all income records
- `totalExpenses` — sum of all expense records
- `netBalance` — income minus expenses
- `categoryTotals` — per-category breakdown with type split
- `recentTransactions` — last 5 records
- `monthlyTrends` — last 12 months grouped by month and type

---

## Example Requests

### Register a user
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "analyst"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@finance.com",
  "password": "password123"
}
```

### Create a financial record (Admin)
```http
POST /api/v1/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2025-03-01",
  "notes": "March salary credit"
}
```

### Get records with filters
```http
GET /api/v1/records?type=expense&category=Groceries&startDate=2025-01-01&endDate=2025-03-31&page=1&limit=10
Authorization: Bearer <token>
```

### Update user role (Admin)
```http
PATCH /api/v1/users/64abc123def456
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "analyst",
  "status": "active"
}
```

### Get dashboard summary
```http
GET /api/v1/dashboard/summary
Authorization: Bearer <token>
```

---

## Design Decisions & Assumptions

**Soft Delete**
Records are never physically removed. `DELETE /records/:id` sets `isDeleted: true`. A Mongoose pre-find hook automatically excludes soft-deleted records from all queries. This preserves audit history.

**Role assignment on register**
The register endpoint accepts a `role` field. In production you would likely restrict this so self-registered users always get `viewer`, with admins elevating roles afterward. This is left open to support flexible seeding and testing.

**Password selection**
The `password` field has `select: false` on the schema. It is only loaded explicitly when needed (e.g., during login via `.select('+password')`), so it is never accidentally exposed.

**Single aggregation strategy for dashboard**
All four dashboard queries (summary, category totals, monthly trends, recent transactions) run concurrently via `Promise.all`. This avoids sequential DB round-trips and keeps latency low.

**Pagination defaults**
Default page size is 10. All list endpoints return a `pagination` envelope with `total`, `page`, `limit`, and `totalPages`.

**JWT storage**
The API issues JWTs in the response body. Storage (localStorage vs httpOnly cookie) is left to the consuming client. For production use, httpOnly cookies with CSRF protection are recommended.

**No refresh tokens**
JWT expiry is configurable via `JWT_EXPIRES_IN`. Refresh tokens are out of scope for this assignment but would be the next step toward a production auth system.

**MongoDB indexes**
Indexes are added on `{ type, category, date }` and `{ isDeleted, date }` to support the most common query and filter patterns efficiently.
