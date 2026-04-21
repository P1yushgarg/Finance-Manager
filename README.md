# Personal Finance Manager

A premium, high-fidelity personal finance dashboard built with modern web technologies. This application allows users to track their expenses, visualize financial data, set goals, and manage their money effectively within a beautiful, dynamic, glass-morphic interface.

## 🌟 Features

- **Interactive Dashboard**: A comprehensive overview of total balance, income, and spending.
- **Advanced Visualizations**: Detailed line, bar, and doughnut charts for spending trends and category analysis.
- **Transaction Tracking**: Log daily expenses, view recent transactions, and categorize spending dynamically.
- **Goal Management**: Interactive modules to add, edit, and track personal financial goals.
- **Premium Aesthetics**: Glass-morphism design, smooth micro-animations, and responsive layouts built entirely with pure CSS.
- **Light & Dark Themes**: Fully supported theme switching with carefully curated color palettes.
- **Authentication Flow**: Mock login/logout state management with session handling.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (`index.css`) with custom CSS variables for maximum flexibility and performance.

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd "Finance Manager"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` (or the port specified by Vite in the terminal).

## 📂 Project Structure

- `/src/components`: Reusable UI elements, forms, layouts, and Recharts components.
- `/src/pages`: Distinct application views (Dashboard Overview, Transactions, Goals, Settings, About Us, etc.).
- `/src/index.css`: The core design system detailing CSS tokens, variables, utility classes, and glass-morphism effects.

## 🎨 Design System

This project strictly adheres to modern web design standards without relying on utility-first frameworks like Tailwind. It leverages vanilla CSS variables to maintain a consistent, rich aesthetic across light and dark modes, featuring smooth gradients and hover effects.
