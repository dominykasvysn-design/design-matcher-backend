// Node.js + Express + SQLite Backend for Game Keys Marketplace
// Run: npm install express cors better-sqlite3
// Start: node server.js

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const Fuse = require('fuse.js');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new Database('gamekeys.db');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    platform TEXT NOT NULL,
    region TEXT NOT NULL,
    original_price REAL NOT NULL,
    sale_price REAL NOT NULL,
    discount_percent INTEGER NOT NULL,
    cashback_amount REAL NOT NULL,
    wishlist_count INTEGER DEFAULT 0
  )
`);

// Seed data if empty
/*
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (title, image_url, platform, region, original_price, sale_price, discount_percent, cashback_amount, wishlist_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    ["Split Fiction EA App Key (PC) GLOBAL", "https://cdn.cdkeys.com/media/catalog/product/s/p/split_fiction_2_1.png=crop", "EA App", "GLOBAL", 49.99, 40.93, 18, 4.50, 626],
    ["Split Fiction (Xbox Series X|S) XBOX LIVE Key EUROPE", "https://cdn.cdkeys.com/media/catalog/product/s/p/split_fiction_2_1.png=crop", "Xbox Live", "EUROPE", 49.99, 34.14, 32, 3.76, 500],
    ["Split Fiction (Xbox Series X|S) XBOX LIVE Key GLOBAL", "https://cdn.cdkeys.com/media/catalog/product/s/p/split_fiction_2_1.png=cropp", "Xbox Live", "GLOBAL", 49.99, 35.15, 30, 3.87, 1039],
    ["Split Fiction (Nintendo Switch 2) eShop Key EUROPE", "https://cdn.cdkeys.com/media/catalog/product/s/p/split_fiction_2_1.png=crop", "Nintendo", "EUROPE", 49.99, 36.25, 28, 3.99, 288],
    ["Cyberpunk 2077 Steam Key GLOBAL", "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop", "Steam", "GLOBAL", 59.99, 29.99, 50, 3.30, 2341],
    ["Elden Ring Steam Key GLOBAL", "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=500&fit=crop", "Steam", "GLOBAL", 59.99, 42.99, 28, 4.73, 1876],
    ["FIFA 24 EA App Key (PC) EUROPE", "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=500&fit=crop", "EA App", "EUROPE", 69.99, 34.99, 50, 3.85, 892],
    ["The Legend of Zelda Nintendo eShop Key EUROPE", "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=500&fit=crop", "Nintendo", "EUROPE", 59.99, 49.99, 17, 5.50, 3421],
    ["Halo Infinite Xbox Live Key GLOBAL", "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=500&fit=crop", "Xbox Live", "GLOBAL", 59.99, 24.99, 58, 2.75, 1543],
    ["Baldur's Gate 3 Steam Key GLOBAL", "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop", "Steam", "GLOBAL", 59.99, 52.99, 12, 5.83, 4532],
    ["Call of Duty: Modern Warfare III Xbox Live Key EUROPE", "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=400&h=500&fit=crop", "Xbox Live", "EUROPE", 69.99, 54.99, 21, 6.05, 987],
    ["Super Mario Bros Wonder Nintendo eShop Key GLOBAL", "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=500&fit=crop", "Nintendo", "GLOBAL", 59.99, 44.99, 25, 4.95, 2156]
  ];

  products.forEach(p => insert.run(...p));
  console.log('Database seeded with sample products');
}
  */

// API Endpoints
// GET /list - Returns all products
// GET /list?search=<query> - Returns filtered products
app.get('/list', (req, res) => {
  const { search } = req.query;

  // Get all products from the DB
  const allProducts = db.prepare('SELECT * FROM products').all();

  if (search) {
    const fuse = new Fuse(allProducts, {
      keys: ['title', 'platform', 'region'], // fields to search
      threshold: 0.4, // adjust: lower = stricter, higher = more forgiving
    });

    const results = fuse.search(search).map(r => r.item);
    return res.json({ products: results, total: results.length });
  }

  res.json({ products: allProducts, total: allProducts.length });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/list`);
});
