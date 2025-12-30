# Game Keys Marketplace - Node.js Backend

## Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Initialize and install dependencies:
   ```bash
   npm init -y
   npm install express cors better-sqlite3
   ```

3. Start the server:
   ```bash
   node server.js
   ```

The server runs on `http://localhost:3001`

## API Endpoints

### GET /list
Returns all products.

**Response:**
```json
{
  "products": [...],
  "total": 12
}
```

### GET /list?search=\<query\>
Returns filtered products matching title, platform, or region.

**Example:** `/list?search=xbox`

## Connecting to Frontend

The React frontend automatically tries to connect to `http://localhost:3001`. 

To change this, set the `VITE_API_URL` environment variable or edit `src/config/api.ts`.

If the backend is not running, the frontend falls back to mock data.
