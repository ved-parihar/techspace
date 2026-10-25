# Wellspend — Personal Finance & Expense Tracker

Full-stack application featuring a modular React 19 + TypeScript + Vite frontend and an Express + Node.js + MongoDB backend with JWT authentication.

---

## 📁 Architecture & Folder Structure

```
my-project/
├── backend/                       # Express & Node.js REST API
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js      # User registration, login, and profile
│   │   ├── transactionController.js # Transaction CRUD operations
│   │   └── budgetController.js    # Budget management & dynamic spending aggregates
│   ├── middleware/
│   │   └── auth.js                # JWT verification & route protection
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt password hashing
│   │   ├── Transaction.js         # Transaction schema matching UI tokens
│   │   └── Budget.js              # Monthly budget limits per category
│   ├── routes/
│   │   ├── auth.js                # /api/auth routes
│   │   ├── transactions.js        # /api/transactions routes
│   │   └── budgets.js             # /api/budgets routes
│   ├── .env                       # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Backend entry point
│
└── frontend/                      # React 19 + TypeScript + Vite application
    ├── public/
    ├── src/
    │   ├── components/            # Reusable UI components
    │   │   ├── Icon.tsx           # SVG icon registry
    │   │   ├── Sidebar.tsx        # Navigation sidebar with active state & profile
    │   │   ├── Topbar.tsx         # Page headers, search, and action triggers
    │   │   ├── StatCard.tsx       # Metric cards (Income, Expenses, Savings rate)
    │   │   ├── TransactionList.tsx# Transaction rows with delete support
    │   │   └── AddTransactionModal.tsx # Interactive modal to record transactions
    │   ├── context/
    │   │   └── AuthContext.tsx    # Global auth state, session persistence, login/logout
    │   ├── pages/                 # Full-page layouts
    │   │   ├── AuthPage.tsx       # Login & signup with real backend validation
    │   │   ├── Overview.tsx       # Live balance, cash flow chart, stats, budget preview
    │   │   ├── Transactions.tsx   # Transaction log with search & category filtering
    │   │   ├── Budgets.tsx        # Monthly budget targets & live category progress
    │   │   ├── Analytics.tsx      # Spending trends & income vs. expense visualizer
    │   │   └── Settings.tsx       # User preferences & account session controls
    │   ├── services/              # API network abstraction
    │   │   ├── api.ts             # Axios instance with automatic JWT interceptors
    │   │   ├── authService.ts     # Auth endpoints
    │   │   ├── transactionService.ts # Transaction CRUD endpoints
    │   │   └── budgetService.ts   # Budget CRUD endpoints
    │   ├── types/
    │   │   └── index.ts           # Centralized TypeScript models & interfaces
    │   ├── App.tsx                # Client-side router & authentication shell
    │   ├── main.tsx
    │   └── index.css              # Custom design system & theme tokens
    ├── package.json
    └── vite.config.ts             # Vite dev server with /api proxy to port 5000
```

---

## 🚀 Getting Started

### 1. Backend Setup

1. Open a terminal in `my-project/backend`:
   ```bash
   cd my-project/backend
   ```
2. Verify or update your database connection in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wellspend?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   # or: node server.js
   ```

### 2. Frontend Setup

1. Open another terminal in `my-project/frontend`:
   ```bash
   cd my-project/frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the local Vite URL (e.g., `http://localhost:8443` or `http://localhost:5173`).

---

## 📡 REST API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Yes | Retrieve authenticated user profile |
| `GET` | `/api/transactions` | Yes | Retrieve user's transaction history |
| `POST` | `/api/transactions` | Yes | Create a new transaction |
| `PUT` | `/api/transactions/:id` | Yes | Update an existing transaction |
| `DELETE` | `/api/transactions/:id` | Yes | Delete a transaction |
| `GET` | `/api/budgets` | Yes | Get monthly budgets with calculated spending |
| `POST` | `/api/budgets` | Yes | Create or update category budget |
| `DELETE` | `/api/budgets/:id` | Yes | Delete category budget |
