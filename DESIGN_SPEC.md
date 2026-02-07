# 🛒 MERN Stack E-Commerce Platform - System Design & Implementation Plan

## 1. Project Overview

**Goal**: Build a production-grade, scalable, secure, and fully responsive E-Commerce platform using the MERN stack.
**Role**: Staff-level Full-Stack Engineer.
**Key Principles**: Scalability, Security, Test-Driven Development (TDD), Clean Architecture.

---

## 2. Architecture Design

We will adhere to a **Client-Server Architecture** with a strict separation of concerns.

### 2.1 High-Level Architecture
- **Client (Frontend)**: React (Vite) Single Page Application (SPA). Handles UI, client-side routing, and state management. Communicates with the Backend via RESTful API.
- **Server (Backend)**: Node.js + Express. Handles business logic, database interactions, authentication, and payments.
- **Database**: MongoDB (Atlas). Stores users, products, orders, and sessions.
- **External Services**:
  - **Stripe**: Payment processing.
  - **Cloudinary/S3** (Optional but recommended): Image hosting (Local testing for now, extensible to cloud).

### 2.2 Directory Structure
The project will use a Monorepo-style structure for code organization (userspace):

```
/ (Root)
├── backend/            # Express Server
│   ├── src/
│   │   ├── config/     # DB, Stripe, Env config
│   │   ├── controllers/# Request handlers (Logic)
│   │   ├── middleware/ # Auth, Error, Validation
│   │   ├── models/     # Mongoose Schemas
│   │   ├── routes/     # API Route definitions
│   │   ├── services/   # Business Logic (Service Layer)
│   │   ├── utils/      # Helpers (Logger, JWT)
│   │   └── app.ts/js   # App entry point
│   ├── tests/          # Backend Tests (Unit/Integration)
│   └── package.json
├── frontend/           # React (Vite) App
│   ├── src/
│   │   ├── api/        # Axios instances & queries
│   │   ├── assets/     # Images, fonts
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React Contexts (Global state)
│   │   ├── hooks/      # Custom Hooks
│   │   ├── pages/      # Page components
│   │   ├── types/      # TS Interfaces / Zod Schemas
│   │   └── main.tsx/jsx
│   ├── tests/          # Frontend Tests
│   └── package.json
└── README.md
```

---

## 3. Technology Stack

### Frontend
- **Core**: React 18+
- **Build Tool**: Vite (Fast, optimized for SPA)
- **Styling**: Tailwind CSS (Utility-first, responsive)
- **State Management**: React Query (Server state), Context API (Client state)
- **Forms**: React Hook Form + Zod (Validation)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (LTS)
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Validation**: Zod (shared schemas preferred) or Joi
- **Auth**: JWT (Access + Refresh Tokens) + BCrypt + Cookie Parser
- **Logging**: Winston + Morgan

### Testing
- **Unit/Integration**: Vitest (Frontend), Jest/Supertest (Backend)
- **E2E**: Playwright or Cypress

---

## 4. Data Models (Schema Design)

### 4.1 User
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (unique, required)
- `passwordHash`: String (required)
- `role`: Enum ['user', 'admin'] (default: 'user')
- `addresses`: Array [AddressSchema]
- `resetPasswordToken`: String
- `resetPasswordExpires`: Date

### 4.2 Product
- `_id`: ObjectId
- `name`: String (indexed)
- `slug`: String (unique, indexed)
- `description`: String
- `price`: Number
- `stock`: Number
- `category`: String (indexed)
- `images`: Array [String] (URLs)
- `rating`: Number (calculated)
- `numReviews`: Number
- `attributes`: Object (Size, Color, etc.)

### 4.3 Order
- `_id`: ObjectId
- `user`: ObjectId (ref: User)
- `orderItems`: Array [{ product: Ref, qty: Number, price: Number }]
- `shippingAddress`: Object
- `paymentMethod`: String (Stripe)
- `paymentResult`: Object (id, status, update_time, email)
- `taxPrice`: Number
- `shippingPrice`: Number
- `totalPrice`: Number
- `isPaid`: Boolean
- `paidAt`: Date
- `isDelivered`: Boolean
- `deliveredAt`: Date
- `status`: Enum ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

---

## 5. API Contracts (Key Endpoints)

### Auth
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Login (Set Cookies)
- `POST /api/auth/logout` - Logout (Clear Cookies)
- `POST /api/auth/refresh` - Refresh Access Token

### Products
- `GET /api/products` - List all (Pagination, Filter, Sort)
- `GET /api/products/:id` - Get details
- `POST /api/products` - Create (Admin)
- `PUT /api/products/:id` - Update (Admin)
- `DELETE /api/products/:id` - Delete (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user history
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/:id/pay` - Update payment status (Webhook preferred, fallback)
- `GET /api/orders` - Get all (Admin)
- `PUT /api/orders/:id/deliver` - Update delivery status (Admin)

### Payment
- `POST /api/create-payment-intent` - Initialize Stripe intent
- `POST /api/webhook` - Handle Stripe events

---

## 6. Implementation Strategy

### Step 1: Backend Skeleton & TDD Setup
- Initialize Node project.
- Configure ESLint/Prettier.
- Set up Jest + Supertest.
- **Test First**: Write a failing test for `GET /health` and `POST /api/auth/register`.
- Implement Server & Routes to pass tests.

### Step 2: Authentication System
- Implement User Model.
- Implement JWT logic (signing, verifying).
- Implement Middleware (`protect`, `admin`).
- **Edge Cases**: Token expiration, invalid signature, duplicate email.

### Step 3: Product API & Logic
- Implement Product Model.
- Implement CRUD.
- **Advanced**: Implement search (RegExp or Text Index) and pagination logic.

### Step 4: Frontend foundation
- Initialize Vite + Tailwind.
- Set up React Router.
- Create Global Layouts (Header, Footer).
- configure generic `api` client (Axios + Interceptors for token refresh).

### Step 5: Core E-Commerce UI
- Product List (Grid).
- Product Details (Gallery, Info).
- Cart Logic (Context + LocalStorage persistence).

### Step 6: Checkout & Payments
- Checkout Form (Address validation).
- Stripe Elements Integration.
- Backend Webhook handling for secure order confirmation.

### Step 7: Admin Panel
- Protected Routes.
- Table views for Users, Products, Orders.
- Edit forms.

### Step 8: Final Polish & Deployment
- Error Boundaries.
- Meta tags (Helmet).
- Dockerfile (Optional).
- Deployment Guide.

---

## 7. Security Measures
- **Helmet**: Secure HTTP Headers.
- **Rate Limiting**: `express-rate-limit` for Auth routes.
- **Sanitization**: `express-mongo-sanitize` to prevent NoSQL injection.
- **XSS**: React handles most, but validate inputs on API (Zod).
- **CORS**: Strict whitelist for frontend domain.
- **Env**: `.env` Management (Never commit secrets).

---

## 8. Deployment Notes
- **Frontend**: Vercel/Netlify (Build Command: `npm run build`, Output: `dist`).
- **Backend**: Render/Heroku/Railway (Start Command: `node dist/app.js` or `ts-node src/app.ts`).
- **Env Variables**: Must match on production.

---

## 9. Setup Instructions (for Developer)
1. `git clone <repo>`
2. `cd backend && npm install`
3. `cd frontend && npm install`
4. Configure `.env` in both folders.
5. `npm run dev` (Concurrent or separate terminals).
6. Run tests: `npm test`.

---
**Status**: Ready for Implementation.
