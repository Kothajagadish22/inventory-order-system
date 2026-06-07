# Inventory & Order Management System

Full-stack inventory and order management application built for the **Technical Assessment (Software Engineer)** requirements.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (JavaScript) + Vite |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| Containerization | Docker + Docker Compose |

## Features

- **Products** — create, list, view, update, delete (name, SKU, price, stock)
- **Customers** — create, list, view, delete (name, email, phone)
- **Orders** — create, list, view details, delete/cancel
- **Dashboard** — total products, customers, orders, and low-stock alerts
- **Business rules**
  - Unique product SKU
  - Unique customer email
  - Stock cannot go negative
  - Orders blocked when inventory is insufficient
  - Stock reduced automatically on order creation
  - Order total calculated by backend

## Project Structure

```
.
├── backend/          # FastAPI application
├── frontend/         # React application
├── docker-compose.yml
├── .env.example
└── README.md
```

## Run Locally with Docker (Recommended)

1. Copy environment variables:

```bash
copy .env.example .env
```

2. Start all services:

```bash
docker compose up --build
```

3. Open the app:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Run Locally without Docker

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

set DATABASE_URL=postgresql://inventory:inventory@localhost:5432/inventory_db
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
set VITE_API_URL=http://localhost:8000
npm run dev
```

Frontend dev server: http://localhost:5173

## API Endpoints

### Products
- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Customers
- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`

### Orders
- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`

### Dashboard
- `GET /dashboard/stats`

## Deployment Guide

### 1) Push to GitHub

```bash
git init
git add .
git commit -m "Add inventory and order management system"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2) Deploy Backend (Render example)

1. Create a **PostgreSQL** database on Render.
2. Create a **Web Service** from your GitHub repo.
3. Set:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment variables:
   - `DATABASE_URL` = Render Postgres connection string
   - `CORS_ORIGINS` = your frontend URL (e.g. `https://your-app.vercel.app`)
   - `LOW_STOCK_THRESHOLD` = `10`

### 3) Build and Push Backend Docker Image (Docker Hub)

```bash
docker build -t <dockerhub-username>/inventory-backend:latest ./backend
docker login
docker push <dockerhub-username>/inventory-backend:latest
```

### 4) Deploy Frontend (Vercel example)

1. Import GitHub repo in Vercel.
2. Set Root Directory to `frontend`.
3. Add environment variable:
   - `VITE_API_URL` = your deployed backend URL
4. Deploy.

### 5) Deploy Frontend (Netlify alternative)

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variable: `VITE_API_URL=<backend-url>`

## Submission Checklist

- [ ] GitHub repository link (frontend + backend)
- [ ] Docker Hub backend image link
- [ ] Live frontend URL
- [ ] Live backend API URL

## Notes

- PostgreSQL data persists through the named Docker volume `postgres_data`.
- Credentials are loaded from environment variables (`.env`), not hardcoded in source code.
- For production, use strong secrets and HTTPS URLs in `CORS_ORIGINS` and `VITE_API_URL`.
