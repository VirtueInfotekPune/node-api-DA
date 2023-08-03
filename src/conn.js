const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      ordered_on TEXT,
      totalPrice REAL,
      deliveryAddress TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY,
      orderId INTEGER,
      productname TEXT,
      productprice REAL,
      quantity TEXT,
      FOREIGN KEY (orderId) REFERENCES orders(id)
    )
  `);
});

module.exports = db;


















