# Xeno FDE Internship Assignment - Shopify Data Ingestion & Insights

This project is a multi-tenant Shopify Data Ingestion & Insights Service built for the Xeno FDE Internship assignment. It consists of a Node.js/Express backend and a Next.js frontend.

## Features

- **Multi-tenancy**: Data is isolated by `tenantId`.
- **Shopify Ingestion**: Simulates fetching Customers, Products, and Orders from Shopify (Mock Data).
- **Analytics Dashboard**: Visualizes Total Sales, Order Counts, Sales Trends, and Top Customers.
- **Date Range Filtering**: Filter sales data by start and end dates.
- **Scheduler**: Background job (node-cron) to sync data periodically (every 5 minutes).
- **Authentication**: Simple email-based login (simulated).

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma (SQLite for local dev), node-cron.
- **Frontend**: Next.js, Tailwind CSS, Recharts, Axios.

## Architecture

```mermaid
graph TD
    User[User] -->|Visits Dashboard| Frontend[Next.js Frontend]
    Frontend -->|API Calls| Backend[Node.js Express Backend]
    Backend -->|Read/Write| DB[(SQLite Database)]
    Backend -->|Sync Data| Shopify[Shopify API (Mock)]
    Scheduler[Cron Job] -->|Triggers Sync| Backend
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database:
   ```bash
   npx prisma db push
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:4000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`.

## Usage

1. Open `http://localhost:3000`.
2. Login with any email (e.g., `user@example.com`).
3. Click **"Start Demo Ingestion"** to simulate fetching data from Shopify.
4. Use the Date Range Picker to filter the Sales Over Time chart.
5. View the dashboard metrics and charts.

## API Endpoints

- `POST /api/ingest`: Trigger data sync for a tenant.
- `GET /api/analytics/stats`: Get summary metrics.
- `GET /api/analytics/sales-over-time`: Get sales trend data. Supports `startDate` and `endDate` query params.
- `GET /api/analytics/top-customers`: Get top spending customers.

## Deployment

### Backend (Render/Railway)
- Connect repository to Render/Railway.
- Set Build Command: `npm install && npm run build`
- Set Start Command: `npm run dev` (or `node dist/server.js` if compiled)
- Add Environment Variables: `DATABASE_URL`.

### Frontend (Vercel)
- Connect repository to Vercel.
- Framework Preset: Next.js.
- Deploy.

## Assumptions & Trade-offs
- **Database**: Used SQLite for simplicity and portability. Production would use PostgreSQL.
- **Authentication**: Implemented a simple email-based session for demo purposes. Real-world would use OAuth or JWT.
- **Ingestion**: Mocked Shopify API responses to avoid needing live store credentials for review.
- **Scheduler**: Runs every 5 minutes for demo purposes.
