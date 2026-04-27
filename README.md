# FinX Manager - Personal Finance Dashboard

A full-stack personal finance dashboard that lets users track expenses, visualize spending patterns, set financial goals, and configure spending alerts. Built with React 19 on the frontend and Node.js/Express with MongoDB on the backend.

## Features

- **Dashboard Overview** - View total income, total spent, and net balance at a glance with recent transactions.
- **Transaction Management** - Add, edit, and delete transactions with categories (Groceries, Dining, Entertainment, Shopping, Utilities) and payment methods (UPI, Cash, Bank Transfer).
- **Spending Visualizations** - Daily spending trends (area chart) and category-wise expense allocation (pie chart) powered by Recharts.
- **Financial Goals** - Create goals with target amounts and deadlines, track progress with visual progress bars.
- **Spending Alerts** - Set threshold limits for monthly spending, daily spending, and per payment method. Get notified when limits are exceeded.
- **Authentication** - User registration and login with JWT tokens and bcrypt password hashing.
- **Glass-morphism UI** - Clean, modern interface built with vanilla CSS and custom CSS variables.

## Tech Stack

### Frontend
- **React 19** with Vite 7
- **React Router v7** for client-side routing
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vanilla CSS** with CSS variables

### Backend
- **Node.js** with Express 5
- **MongoDB** with Mongoose 9
- **JWT** for authentication
- **bcryptjs** for password hashing

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Finance-Manager
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file inside the `backend/` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

6. In a separate terminal, start the frontend:
   ```bash
   npm run dev
   ```

7. Open `http://localhost:5173` in your browser.

## Project Structure

```
Finance-Manager/
├── src/                        # Frontend (React)
│   ├── components/
│   │   ├── charts/             # Recharts visualizations
│   │   ├── forms/              # Transaction form
│   │   └── layout/             # Navbar, Sidebar, Footer
│   ├── pages/
│   │   ├── Auth/               # Login, Signup
│   │   └── Dashboard/          # Overview, Transactions, Goals, Alerts, UserDetails
│   ├── App.jsx                 # Route configuration
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles and design tokens
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/                 # Mongoose schemas (User, Transaction, Goal, Alert)
│   ├── routes/                 # Express routes (auth, transactions, goals, alerts)
│   └── server.js               # Express server entry point
├── package.json                # Frontend dependencies
└── vite.config.js              # Vite config with API proxy
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/transactions?userId=` | Get all transactions for a user |
| POST | `/api/transactions` | Create a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/goals?userId=` | Get all goals for a user |
| POST | `/api/goals` | Create a goal |
| PUT | `/api/goals/:id` | Update a goal |
| DELETE | `/api/goals/:id` | Delete a goal |
| GET | `/api/alerts?userId=` | Get all alerts for a user |
| POST | `/api/alerts` | Create or update an alert |
| DELETE | `/api/alerts` | Delete an alert |

## Team

- Piyush Garg
- Mayank Rana
- Muskan Garg
