const pool = require("../config/db");

const addFood = async (req, res) => {
  const { foodname, price, offer, description, tags } = req.body;


  try {

   if (!foodname || !price || !description || !tags) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    if(!offer){
        return res.status(400).json({error:"Please fill the offer feild. If no offer then write 0"})
    }
    if(!req.file){
        return res.status(400).json({error:"Please upload an image"})
    }

    // Insert data into the database
    const query = `
      INSERT INTO admin (food_name, price, offer, description, tags, image, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    
    // Example: Assume the image comes from the request
    const image = `/uploads/foodimage/${req.file.filename}`

    const values = [foodname, price, offer, description, tags, image];

    const result = await pool.query(query, values);

    // Send a response back
    return res.status(201).json({
      message: "Food added successfully",
      food: result.rows[0], // Return the inserted row
    });
  } catch (error) {
    console.error("Error adding food:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getFood= async (req,res)=>{
    try{
        const food = await pool.query("SELECT * FROM admin");
        return res.json(food.rows);

    }
    catch(error){
        console.error("Error fetching food:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const updateFood = async (req, res) => {
    const { foodname, price, offer, description, tags } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.path : null; // Extract the image path if uploaded
    console.log("Request Body:", req.body);
    try {
      // Check if the food item exists
      const food = await pool.query("SELECT * FROM admin WHERE food_id = $1", [id]);
      if (food.rows.length === 0) {
        return res.status(404).json({ error: "Food not found" });
      }
  
      // Log request body to ensure expected values are being received
      
  
      // Build dynamic query to update fields that are provided
      const queryFields = [];
      const values = [];
      let index = 1;
  
      if (foodname) {
        queryFields.push(`food_name = $${index++}`);
        values.push(foodname);
      }
      if (price) {
        queryFields.push(`price = $${index++}`);
        values.push(price);
      }
      if (offer) {
        queryFields.push(`offer = $${index++}`);
        values.push(offer);
      }
      if (description) {
        queryFields.push(`description = $${index++}`);
        values.push(description);
      }
      if (tags) {
        queryFields.push(`tags = $${index++}`);
        values.push(tags);
      }
      if (image) {
        queryFields.push(`image = $${index++}`);
        values.push(image);
      }
  
      // Add updated_at field
      queryFields.push(`updated_at = CURRENT_TIMESTAMP`);
  
      // Add the food id to the WHERE clause, and push it last in the values array
      queryFields.push(`food_id = $${index}`);
      values.push(id);
  
      // Log query and values for debugging
      console.log("Generated Query:", queryFields.join(", "));
      console.log("Values Array:", values);
  
      // Finalize the query
      const query = `
        UPDATE admin
        SET ${queryFields.join(", ")}
        WHERE food_id = $${index}
        RETURNING *;
      `;
  
      // Execute the query
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Food update failed" });
      }
  
      return res.json({
        message: "Food updated successfully",
        food: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating food:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
module.exports = { addFood,getFood,updateFood };
