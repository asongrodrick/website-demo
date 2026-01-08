-- SQLite schema for autospareparts
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT,
  img TEXT,
  description TEXT
);
