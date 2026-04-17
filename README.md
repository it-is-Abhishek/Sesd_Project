# Sesd Shop

Full-stack e-commerce starter built with React, Vite, Express, and MongoDB.

## Features

- Product catalog persisted in MongoDB
- Category filtering and text search
- Product detail pages using slugs
- Clerk authentication for sign-in and protected checkout
- Cart stored in browser local storage
- Checkout that saves orders to MongoDB
- Contact form that saves customer inquiries to MongoDB
- Automatic initial product seeding when the catalog is empty

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set your MongoDB and Clerk keys:

```bash
cp .env.example .env
```

3. Set `VITE_CLERK_PUBLISHABLE_KEY` for the Vite client and `CLERK_SECRET_KEY` for the Express server.

4. Start MongoDB locally or use a MongoDB Atlas URI in `MONGODB_URI`.

5. Start the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:4001/api`

## Seed products manually

If you want to replace the catalog with the sample data:

```bash
npm run seed --workspace=server
```

## API endpoints

- `GET /api/health`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:slugOrId`
- `POST /api/contact`
- `POST /api/orders`
- `GET /api/orders/:id`
