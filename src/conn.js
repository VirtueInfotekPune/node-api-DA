const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite3'); // Specify the database file name
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create the orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      ordered_on TEXT,
      totalPrice REAL,
      deliveryAddress TEXT
    )
  `);

  // Create the items table
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY,
      orderId INTEGER,
      productname TEXT,
      productprice REAL,
      quantity TEXT,
      image TEXT,
      offer TEXT,
      subcategory TEXT,
      uom TEXT,
      FOREIGN KEY (orderId) REFERENCES orders(id)
    )
  `);

  console.log('Database and tables created.');
});

// db.close();
module.exports = db;
