const db = require('./conn');

const Order = {
  create: (ordered_on, totalPrice, deliveryAddress) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO orders (ordered_on, totalPrice, deliveryAddress) VALUES (?, ?, ?)`;
      db.run(query, [ordered_on, totalPrice, deliveryAddress], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  },

  getWithItems: (orderId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT o.*, i.productname, i.productprice, i.quantity,
               i.image, i.offer, i.subcategory, i.uom
        FROM orders o
        JOIN items i ON o.id = i.orderId
        WHERE o.id = ?
      `;
      db.all(query, [orderId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const order = {
            id: rows[0].id,
            ordered_on: rows[0].ordered_on,
            totalPrice: rows[0].totalPrice,
            deliveryAddress: rows[0].deliveryAddress,
            items: rows.map(row => ({
              productname: row.productname,
              productprice: row.productprice,
              quantity: row.quantity,
              image: row.image,
              offer: row.offer,
              subcategory: row.subcategory,
              uom: row.uom
            }))
          };
          resolve(order);
        }
      });
    });
  }
};

const Item = {
  create: (orderId, productname, productprice, quantity, image, offer, subcategory, uom) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO items (orderId, productname, productprice, quantity, image, offer, subcategory, uom) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      db.run(query, [orderId, productname, productprice, quantity, image, offer, subcategory, uom], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
};

module.exports = { Order, Item };


















