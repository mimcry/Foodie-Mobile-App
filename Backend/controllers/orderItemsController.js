const { response } = require("express");
const pool = require("../config/db");


const putorderitems =async (req,res)=>{
    const { user_id, total_amount, items } = req.body;
    try {
        // Insert order details into the orders table
        const result = await pool.query(
          'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
          [user_id, total_amount, 'Pending']
        );
    
        const order_id = result.rows[0].id;
    
        // Insert order items into the order_items table
        for (let item of items) {
          const { food_item_id, quantity, price } = item;
          const total_price = quantity * price;
    
          await pool.query(
            'INSERT INTO order_items (user_id, order_id, food_item_id, quantity, price, total_price) VALUES ($1, $2, $3, $4, $5,$6)',
            [user_id,order_id, food_item_id, quantity, price, total_price]
          );
        }
    
        res.status(201).json({ message: 'Order placed successfully', order_id });
      } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error placing order' });
      }
}
const getorderitems = async (req, res) => {
  const { id } = req.params;
  console.log("User ID received:", id);
  const { user } = req;

  // Authorization check
  if (parseInt(id) !== user.id) {
      console.log("Authorization failed: User is not authorized");
      return res.status(403).json({ error: "You are not authorized to view this profile" });
  }

  try {
      // Fetch order details along with food details
      const query = `
          SELECT 
              o.id AS order_id, 
              o.order_date, 
              o.status, 
              o.total_amount, 
              oi.food_item_id, 
              oi.quantity, 
              oi.total_price, 
              f.food_name AS food_name, 
              f.price AS food_price, 
              f.image AS food_image, 
              f.description AS food_description
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          JOIN admin f ON oi.food_item_id = f.food_id
          WHERE o.user_id = $1
      `;

      const { rows } = await pool.query(query, [id]);


      if (rows.length === 0) {
          console.log("No orders found for this user");
          return res.status(404).json({ error: "No orders found for this user" });
      }

      // Grouping orders by order_id
      const orders = {};
      rows.forEach(row => {
          if (!orders[row.order_id]) {
              orders[row.order_id] = {
                  order_id: row.order_id,
                  order_date: row.order_date,
                  status: row.status,
                  total_amount: row.total_amount,
                  items: []
              };
          }
          orders[row.order_id].items.push({
              food_item_id: row.food_item_id,
              food_name: row.food_name,
              quantity: row.quantity,
              total_price: row.total_price,
              price: row.food_price,
             image: row.food_image,
              description: row.food_description
          });
      });

 

      res.json({ orders: Object.values(orders) });

  } catch (error) {
      console.error("Error fetching user order details:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { putorderitems,getorderitems };