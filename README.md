# 🛒 MERN E-Commerce Platform

A production-grade, scalable e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### User Features
- 🔐 User authentication (Register, Login, JWT)
- 🛍️ Product browsing with search, filters, and sorting
- ⭐ Product ratings and reviews
- 🛒 Persistent shopping cart
- 💳 Secure checkout with Stripe
- 📦 Order tracking and history

### Admin Features
- 📊 Dashboard with statistics
- 📝 Product management (CRUD)
- 👥 User management
- 📋 Order management

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS
- React Query (TanStack Query)
- React Hook Form + Zod
- React Router DOM
- Lucide React (icons)

### Backend
- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Stripe Payment Integration
- bcrypt for password hashing

## Getting Started
<!-- Deployment Trigger: 2026-02-09 Attempt 2 -->

### Prerequisites
- Node.js 18+ (LTS)
- MongoDB (local or Atlas)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd 2_ecommerce_website
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

**Development Mode**
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

**Production Build**
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── tests/               # Jest tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Page components
│   │   └── App.tsx          # Main app component
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/users/auth` - Login
- `POST /api/users/logout` - Logout
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product
- `GET /api/products/top` - Top rated products
- `GET /api/products/categories` - List categories
- `POST /api/products/:id/reviews` - Add review

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:productId` - Remove item
- `PUT /api/cart/sync` - Sync local cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - User orders
- `GET /api/orders/:id` - Get order
- `PUT /api/orders/:id/pay` - Update to paid

### Payments
- `GET /api/payments/config` - Stripe config
- `POST /api/payments/create-payment-intent` - Create payment

## Testing

```bash
# Backend tests
cd backend
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Backend (Node.js)
1. Build: `npm run build`
2. Set environment variables
3. Start: `npm start`

### Frontend (Static)
1. Build: `npm run build`
2. Deploy `dist/` folder to CDN/static host

## License

MIT
