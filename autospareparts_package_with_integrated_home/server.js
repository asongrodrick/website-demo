// Simple Node.js Express server to serve products from SQLite
// Run: npm install express sqlite3 cors
// Then: node server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const DB_FILE = path.join(__dirname, 'autospareparts.db');
const db = new sqlite3.Database(DB_FILE);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// GET /api/products
app.get('/api/products', (req, res) => {
  const q = 'SELECT id,title,price,category,img,description FROM products ORDER BY id LIMIT 200';
  db.all(q, [], (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// GET /api/product/:id
app.get('/api/product/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if(err) return res.status(500).json({error: err.message});
    if(!row) return res.status(404).json({error: 'Not found'});
    res.json(row);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Server running on http://localhost:'+PORT));


// Added route for home page
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
