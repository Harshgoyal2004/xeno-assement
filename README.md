# 🚀 Xeno FDE Internship Assignment - Shopify Data Ingestion & Insights Service

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

**A comprehensive multi-tenant Shopify Data Ingestion & Analytics Platform**

[Features](#-features) • [Architecture](#-architecture) • [Setup](#-setup-instructions) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Setup Instructions](#-setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Analytics Features](#-analytics-features)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Assumptions & Trade-offs](#-assumptions--trade-offs)

---

## 🌟 Overview

This project is a **full-stack multi-tenant Shopify Data Ingestion & Insights Service** built for the Xeno FDE Internship assignment. It simulates enterprise-level retail analytics capabilities, enabling multiple tenants to ingest, store, and analyze their Shopify store data through an intuitive dashboard.

The platform provides real-time analytics, customer segmentation, geographic insights, and advanced metrics like RFM analysis, cart abandonment tracking, and average order value trends.

### Key Highlights

- 🏢 **Multi-tenant Architecture**: Complete data isolation per tenant
- 📊 **Advanced Analytics**: 10+ analytics endpoints with real-time insights
- 🗺️ **Geographic Visualization**: Interactive India map with state-wise sales distribution
- 🔄 **Automated Data Sync**: Background scheduler for periodic data ingestion
- 📈 **Rich Visualizations**: Interactive charts and graphs using Recharts
- 🎨 **Modern UI**: Built with Next.js 16, React 19, and Tailwind CSS 4
- 🔐 **Authentication System**: Email-based authentication with user management

---

## ✨ Features

### Core Features

- **Multi-tenancy Support**: Data is completely isolated by `tenantId`, supporting multiple independent stores
- **Shopify Data Ingestion**: Simulates fetching Customers, Products, and Orders from Shopify API (using mock data)
- **Comprehensive Analytics Dashboard**: 
  - Total Sales, Order Counts, Customer Counts
  - Revenue Trends over Time
  - Top Customers by Spend
  - Geographic Distribution (India Map)
  - Category-wise Sales Analysis
  - Customer Retention Metrics
  - RFM Segmentation (Recency, Frequency, Monetary)
  - Cart Abandonment Tracking
  - Average Order Value (AOV) Trends

### Advanced Features

- **Date Range Filtering**: Filter all time-series data by custom date ranges
- **Automated Scheduler**: Background cron job syncs data every 5 minutes
- **Real-time Updates**: Instant data refresh on ingestion
- **Responsive Design**: Mobile-friendly dashboard with Tailwind CSS
- **Interactive Visualizations**: 
  - Line charts for trends
  - Bar charts for comparisons
  - Pie charts for distributions
  - Interactive India map with tooltips
- **User Authentication**: Secure email-based login system
- **Webhook Support**: Ready for Shopify webhook integration
- **Event Streaming**: Server-Sent Events (SSE) for real-time updates

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 5.1.0 | Web framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Prisma** | 5.22.0 | ORM and database toolkit |
| **SQLite** | - | Database (local dev) |
| **node-cron** | 4.2.1 | Task scheduling |
| **Axios** | 1.13.2 | HTTP client |
| **CORS** | 2.8.5 | Cross-origin resource sharing |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.5 | React framework |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 4 | Styling framework |
| **Recharts** | 3.5.0 | Chart library |
| **Lucide React** | 0.555.0 | Icon library |
| **React Simple Maps** | 3.0.0 | Geographic visualization |
| **React Tooltip** | 5.30.0 | Interactive tooltips |
| **Axios** | 1.13.2 | API client |

---

## 🏗 Architecture

```mermaid
graph TD
    User[👤 User] -->|Visits Dashboard| Frontend[Next.js Frontend]
    Frontend -->|API Calls| Backend[Node.js Express Backend]
    Backend -->|Read/Write| DB[(SQLite Database)]
    Backend -->|Sync Data| Shopify["Shopify API (Mock)"]
    Scheduler[⏰ Cron Job] -->|Triggers Sync Every 5min| Backend
    Backend -->|SSE Events| Frontend
    Backend -->|Webhooks| Shopify
    
    style Frontend fill:#61dafb,stroke:#333,stroke-width:2px
    style Backend fill:#68a063,stroke:#333,stroke-width:2px
    style DB fill:#003b57,stroke:#333,stroke-width:2px
    style Scheduler fill:#ff6b6b,stroke:#333,stroke-width:2px
```

### System Flow

1. **User Authentication**: Users log in with email credentials
2. **Data Ingestion**: Manual trigger or automated scheduler fetches data from Shopify (mock)
3. **Data Storage**: Prisma ORM stores data in SQLite with tenant isolation
4. **Analytics Processing**: Backend aggregates and processes data for various metrics
5. **Visualization**: Frontend displays interactive charts and maps
6. **Real-time Updates**: SSE streams updates to connected clients

---

## 🗄 Database Schema

The application uses Prisma ORM with the following schema:

```mermaid
erDiagram
    Tenant ||--o{ Customer : has
    Tenant ||--o{ Product : has
    Tenant ||--o{ Order : has
    Tenant ||--o{ User : has
    Tenant ||--o{ CartAbandonment : has
    Customer ||--o{ Order : places
    
    Tenant {
        string id PK
        string name
        string shopifyDomain UK
        string accessToken
        datetime createdAt
        datetime updatedAt
    }
    
    Customer {
        string id PK
        string shopifyId
        string email
        string firstName
        string lastName
        string city
        string country
        float totalSpent
        int ordersCount
        string tenantId FK
    }
    
    Product {
        string id PK
        string shopifyId
        string title
        string category
        float price
        string tenantId FK
    }
    
    Order {
        string id PK
        string shopifyId
        float totalPrice
        string currency
        datetime createdAt
        string tenantId FK
        string customerId FK
    }
    
    User {
        string id PK
        string email UK
        string password
        string tenantId FK
        datetime createdAt
    }
    
    CartAbandonment {
        string id PK
        string cartId
        string checkoutUrl
        float totalPrice
        datetime createdAt
        string tenantId FK
    }
```

### Key Relationships

- **Tenant**: Central entity for multi-tenancy
- **Customer**: Linked to orders and tenant
- **Product**: Catalog items per tenant
- **Order**: Transaction records with customer association
- **User**: Authentication and tenant access
- **CartAbandonment**: Tracks incomplete checkouts

---

## 📦 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harshgoyal2004/xeno-assement.git
   cd xeno-assement
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=4000
   ```

5. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The backend server will start on `http://localhost:4000`

   **Expected Output:**
   ```
   Server running on port 4000
   Scheduler started - will sync data every 5 minutes
   ```

### Frontend Setup

1. **Open a new terminal** and navigate to frontend directory
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

   **Expected Output:**
   ```
   ▲ Next.js 16.0.5
   - Local:        http://localhost:3000
   - Ready in 2.3s
   ```

---

## 📖 Usage Guide

### First Time Setup

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Login Page**: You'll see the authentication screen
   - Enter any email (e.g., `user@example.com`)
   - Enter any password (e.g., `password123`)
   - Click **Sign In** or **Sign Up**

3. **Dashboard**: After login, you'll see the main analytics dashboard

### Ingesting Data

1. **Click the "Start Demo Ingestion" button** in the top-right corner
2. Wait for the success message
3. The dashboard will automatically refresh with new data

### Exploring Analytics

The dashboard has multiple tabs:

- **📊 Overview**: Key metrics and revenue trends
- **👥 Customers**: Top customers and retention analysis
- **🗺️ Geography**: India map with state-wise sales
- **📦 Products**: Category-wise sales distribution
- **🎯 Segments**: RFM customer segmentation
- **🛒 Carts**: Cart abandonment tracking

### Using Date Filters

1. Select a tab with time-series data (Overview, Segments, Carts)
2. Use the date picker to select start and end dates
3. Charts will automatically update

---

## 🔌 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "tenantName": "My Store",
  "shopifyDomain": "mystore.myshopify.com"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "tenantId": "uuid"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "tenantId": "uuid"
  }
}
```

### Data Ingestion Endpoints

#### Trigger Data Sync
```http
POST /ingest
Content-Type: application/json

{
  "tenantId": "uuid"
}
```

**Response:**
```json
{
  "message": "Data ingestion completed",
  "stats": {
    "customers": 50,
    "products": 20,
    "orders": 100
  }
}
```

### Analytics Endpoints

#### Get Summary Statistics
```http
GET /analytics/stats?tenantId=uuid
```

**Response:**
```json
{
  "totalRevenue": 125000.50,
  "ordersCount": 100,
  "customersCount": 50
}
```

#### Get Sales Over Time
```http
GET /analytics/sales-over-time?tenantId=uuid&startDate=2024-01-01&endDate=2024-12-31
```

**Query Parameters:**
- `tenantId` (required): Tenant identifier
- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "sales": 5000.00
  },
  {
    "date": "2024-01-02",
    "sales": 7500.00
  }
]
```

#### Get Top Customers
```http
GET /analytics/top-customers?tenantId=uuid
```

**Response:**
```json
[
  {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "totalSpent": 15000.00,
    "ordersCount": 25
  }
]
```

#### Get Geographic Distribution
```http
GET /analytics/geo-distribution?tenantId=uuid
```

**Response:**
```json
[
  {
    "city": "Mumbai",
    "totalSpent": 50000.00,
    "customersCount": 15
  },
  {
    "city": "Delhi",
    "totalSpent": 35000.00,
    "customersCount": 10
  }
]
```

#### Get Category Sales
```http
GET /analytics/category-sales?tenantId=uuid
```

**Response:**
```json
[
  {
    "category": "Electronics",
    "totalSales": 75000.00
  },
  {
    "category": "Clothing",
    "totalSales": 50000.00
  }
]
```

#### Get Customer Retention
```http
GET /analytics/customer-retention?tenantId=uuid
```

**Response:**
```json
{
  "oneTime": 30,
  "repeat": 20
}
```

#### Get RFM Segments
```http
GET /analytics/rfm-segments?tenantId=uuid
```

**Response:**
```json
[
  {
    "name": "Champions",
    "value": 15
  },
  {
    "name": "Loyal",
    "value": 20
  },
  {
    "name": "AtRisk",
    "value": 10
  },
  {
    "name": "Lost",
    "value": 5
  }
]
```

#### Get Cart Abandonment Stats
```http
GET /analytics/cart-abandonment?tenantId=uuid
```

**Response:**
```json
{
  "totalAbandonedValue": 25000.00,
  "abandonedCartsCount": 15
}
```

#### Get AOV Trend
```http
GET /analytics/aov-trend?tenantId=uuid&startDate=2024-01-01&endDate=2024-12-31
```

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "aov": 1250.00
  },
  {
    "date": "2024-01-02",
    "aov": 1500.00
  }
]
```

### Webhook Endpoints

#### Shopify Order Webhook
```http
POST /webhooks/shopify/orders
Content-Type: application/json
X-Shopify-Shop-Domain: mystore.myshopify.com

{
  "id": 123456789,
  "total_price": "299.99",
  "currency": "USD",
  "created_at": "2024-01-01T12:00:00Z",
  "customer": {
    "id": 987654321,
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Smith"
  }
}
```

#### Cart Abandonment Webhook
```http
POST /webhooks/shopify/carts
Content-Type: application/json
X-Shopify-Shop-Domain: mystore.myshopify.com

{
  "id": "cart123",
  "checkout_url": "https://mystore.myshopify.com/checkout/cart123",
  "total_price": "150.00",
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Event Streaming

#### Subscribe to Real-time Events
```http
GET /events?tenantId=uuid
Accept: text/event-stream
```

**Event Types:**
- `data-sync`: Triggered when data ingestion completes
- `new-order`: Triggered when a new order is received
- `cart-abandoned`: Triggered when a cart is abandoned

---

## 📊 Analytics Features

### 1. Revenue Trends
- **Line chart** showing daily/weekly/monthly revenue
- **Date range filtering** for custom periods
- **Trend indicators** for growth analysis

### 2. Customer Segmentation (RFM)
- **Champions**: High value, recent, frequent buyers
- **Loyal Customers**: Regular purchasers
- **At Risk**: Previously active, now declining
- **Lost**: Haven't purchased in a long time
- **New**: Recent first-time buyers

### 3. Geographic Insights
- **Interactive India map** with state-wise data
- **City-level analysis** with top 10 cities
- **Tooltips** showing sales and customer counts

### 4. Product Analytics
- **Category-wise sales** distribution
- **Pie charts** for visual comparison
- **Revenue breakdown** by product category

### 5. Customer Retention
- **One-time vs Repeat** customer analysis
- **Retention rate** calculations
- **Visual comparison** charts

### 6. Cart Abandonment
- **Total abandoned value** tracking
- **Abandonment count** metrics
- **Recovery opportunity** identification

### 7. Average Order Value (AOV)
- **Trend analysis** over time
- **Date range filtering**
- **Comparison** with revenue trends

---

## 🚀 Deployment

### Backend Deployment (Render/Railway)

#### Using Render

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command**: `cd backend && npm install && npx prisma generate && npm run build`
   - **Start Command**: `cd backend && node dist/server.js`
   - **Environment Variables**:
     ```
     DATABASE_URL=postgresql://user:password@host:5432/dbname
     PORT=4000
     ```

4. **Deploy** and wait for the build to complete

#### Using Railway

1. **Create a new project** on [Railway](https://railway.app)
2. **Add PostgreSQL database** from the marketplace
3. **Deploy from GitHub**
4. **Set environment variables**:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   PORT=4000
   ```

### Frontend Deployment (Vercel)

1. **Import your repository** on [Vercel](https://vercel.com)
2. **Framework Preset**: Next.js
3. **Root Directory**: `frontend`
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```
5. **Deploy**

### Database Migration for Production

For production, migrate from SQLite to PostgreSQL:

1. **Update `schema.prisma`**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

---

## 📁 Project Structure

```
xeno-assement/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── analytics.ts      # Analytics endpoints
│   │   │   ├── auth.ts           # Authentication routes
│   │   │   ├── events.ts         # SSE event streaming
│   │   │   ├── ingest.ts         # Data ingestion
│   │   │   └── webhooks.ts       # Shopify webhooks
│   │   ├── services/
│   │   │   ├── scheduler.ts      # Cron job scheduler
│   │   │   └── shopifyService.ts # Shopify API mock
│   │   ├── prisma/
│   │   │   └── client.ts         # Prisma client instance
│   │   ├── data/
│   │   │   └── mockData.ts       # Mock Shopify data
│   │   └── server.ts             # Express server setup
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── dev.db                # SQLite database
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Dashboard page
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Login page
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── globals.css       # Global styles
│   │   ├── components/
│   │   │   ├── AuthContext.tsx   # Auth state management
│   │   │   ├── IndiaMap.tsx      # Geographic visualization
│   │   │   └── ui/
│   │   │       └── card.tsx      # Card component
│   │   └── lib/
│   │       └── utils.ts          # Utility functions
│   ├── public/
│   │   └── india-states.json     # India map data
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=4000

# For Production (PostgreSQL)
# DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

### Frontend (.env.local)

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# For Production
# NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend won't start

**Error**: `Port 4000 is already in use`

**Solution**:
```bash
# Find and kill the process using port 4000
lsof -ti:4000 | xargs kill -9

# Or change the port in .env
PORT=4001
```

#### 2. Database connection errors

**Error**: `Can't reach database server`

**Solution**:
```bash
# Regenerate Prisma client
cd backend
npx prisma generate
npx prisma db push
```

#### 3. Frontend API calls failing

**Error**: `Network Error` or `CORS Error`

**Solution**:
- Ensure backend is running on `http://localhost:4000`
- Check CORS configuration in `backend/src/server.ts`
- Verify `NEXT_PUBLIC_API_URL` in frontend

#### 4. No data showing on dashboard

**Solution**:
1. Click "Start Demo Ingestion" button
2. Check browser console for errors
3. Verify backend logs for ingestion success
4. Ensure you're logged in with a valid tenant

#### 5. Prisma errors after schema changes

**Solution**:
```bash
cd backend
npx prisma generate
npx prisma db push
npm run dev
```

### Development Tips

- **Clear browser cache** if UI doesn't update
- **Check browser console** for frontend errors
- **Check terminal logs** for backend errors
- **Use Prisma Studio** to inspect database:
  ```bash
  cd backend
  npx prisma studio
  ```

---

## 💡 Assumptions & Trade-offs

### Assumptions

1. **Database**: 
   - Used **SQLite** for simplicity and portability during development
   - Production deployment would use **PostgreSQL** for better performance and scalability

2. **Authentication**: 
   - Implemented **simple email-based authentication** for demo purposes
   - Real-world application would use **OAuth 2.0**, **JWT tokens**, or **session management**
   - Passwords are stored in plain text (NOT PRODUCTION READY)

3. **Shopify Integration**: 
   - **Mocked Shopify API responses** to avoid needing live store credentials
   - Real implementation would use Shopify REST/GraphQL API with proper authentication

4. **Data Sync Scheduler**: 
   - Runs **every 5 minutes** for demo purposes
   - Production would use configurable intervals based on business needs

5. **Multi-tenancy**: 
   - Tenant isolation is handled at the **application level**
   - Production might use **database-level isolation** or **schema per tenant**

### Trade-offs

| Decision | Reason | Production Alternative |
|----------|--------|----------------------|
| SQLite | Easy setup, no external dependencies | PostgreSQL with connection pooling |
| Mock Data | No Shopify credentials needed | Real Shopify API integration |
| Simple Auth | Quick demo implementation | OAuth 2.0, JWT, secure sessions |
| Client-side tenantId | Simplified demo flow | Server-side session management |
| 5-min scheduler | Frequent updates for demo | Configurable intervals, webhook-driven |
| No caching | Simpler implementation | Redis for analytics caching |
| No rate limiting | Demo simplicity | Rate limiting middleware |

### Security Considerations (Production)

- ✅ Hash passwords with bcrypt
- ✅ Implement JWT-based authentication
- ✅ Add rate limiting to API endpoints
- ✅ Validate and sanitize all inputs
- ✅ Use HTTPS in production
- ✅ Implement proper CORS policies
- ✅ Add request logging and monitoring
- ✅ Use environment-based secrets management

---

## 📝 License

ISC License - See LICENSE file for details

---

## 👨‍💻 Author

**Harsh Goyal**

- GitHub: [@Harshgoyal2004](https://github.com/Harshgoyal2004)
- Repository: [xeno-assement](https://github.com/Harshgoyal2004/xeno-assement)

---

## 🙏 Acknowledgments

- Built for **Xeno FDE Internship Assignment**
- Inspired by enterprise retail analytics platforms
- Uses modern web technologies and best practices

---

<div align="center">

**Made with ❤️ for Xeno**

[⬆ Back to Top](#-xeno-fde-internship-assignment---shopify-data-ingestion--insights-service)

</div>
