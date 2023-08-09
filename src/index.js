// const express = require('express');
const express = require('express')
const { Order, Item } = require('./orders');
const app = express();
const port = process.env.PORT || 5000;
const db = require('./conn')
const cors = require('cors')

app.use(express.json());
app.use(cors())

//post 
app.post('/orders', async (req, res) => {
  try {
    const { ordered_on, totalPrice, deliveryAddress, items } = req.body;
    const orderId = await Order.create(ordered_on, totalPrice, deliveryAddress);

    for (const item of items) {
      await Item.create(orderId, item.productname, item.productprice, item.quantity, item.image, item.offer, item.subcategory, item.uom);
    }

    const createdOrder = await Order.getWithItems(orderId);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send('Error');
  }
});

//get
app.get('/orders', async (req, res) => {
  try {
    const query = `
      SELECT o.id, o.ordered_on, o.totalPrice, o.deliveryAddress,
             i.productname, i.productprice, i.quantity,
             i.image, i.offer, i.subcategory, i.uom
      FROM orders o
      LEFT JOIN items i ON o.id = i.orderId
    `;

    console.log('Executing query:', query);

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      console.log('Rows retrieved:', rows);

      const orders = [];
      let currentOrderId = null;
      let currentOrder = null;

      rows.forEach(row => {
        if (row.id !== currentOrderId) {
          if (currentOrder) {
            orders.push(currentOrder);
          }
          currentOrderId = row.id;
          currentOrder = {
            id: row.id,
            ordered_on: row.ordered_on,
            totalPrice: row.totalPrice,
            deliveryAddress: row.deliveryAddress,
            items: [],
          };
        }
        currentOrder.items.push({
          productname: row.productname,
          productprice: row.productprice,
          quantity: row.quantity,
          image: row.image,         // Include the image property
          offer: row.offer,         // Include the offer property
          subcategory: row.subcategory, // Include the subcategory property
          uom: row.uom              // Include the uom property
        });
      });

      if (currentOrder) {
        orders.push(currentOrder);
      }

      res.status(200).json(orders);
    });
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//delete
app.delete('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const deleteOrderQuery = `DELETE FROM orders WHERE id = ?`;

    db.run(deleteOrderQuery, [orderId], (err) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(200).json({ message: `Order with ID ${orderId} has been deleted.` });
    });
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`The server is running on http://127.0.0.1:${port}`);
});
