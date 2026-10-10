# Kite Project

This repository is split into separate folders for the frontend and backend.

## Project Structure

```text
Kite/
├── frontend/          # Next.js (App Router) + Tailwind CSS
│   ├── src/
│   │   └── app/
│   ├── public/
│   └── package.json
└── backend/           # Node.js + Express API
    ├── src/
    │   └── server.js
    ├── .env
    └── package.json
```

## Getting Started

### 1. Frontend (Next.js + Tailwind CSS)

```bash
cd frontend
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000).

### 2. Backend (Node.js + Express)

```bash
cd backend
npm run dev
```

The backend server will run on [http://localhost:5000](http://localhost:5000).
- Health check: `http://localhost:5000/api/health`
