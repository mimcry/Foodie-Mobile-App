const pool = require("../config/db");

const addFood = async (req, res) => {
  const { foodname, price, offer, description, tags,calories,duration } = req.body;
  console.log("Request Body:", req.body);

  try {
    if (!foodname || !price || !description || !tags) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    if (!offer) {
      return res
        .status(400)
        .json({
          error: "Please fill the offer feild. If no offer then write 0",
        });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    // Insert data into the database
    const query = `
      INSERT INTO admin (food_name, price, offer, description, tags, image,calories,duration, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6,$7,$8,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    // Example: Assume the image comes from the request
    const image = `/uploads/foodimage/${req.file.filename}`;

    const values = [foodname, price, offer, description, tags, image,calories,duration];

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
const getFood = async (req, res) => {
  try {
    // Query to get food items along with their ratings and reviews
    const food = await pool.query(`
      SELECT 
        admin.food_id AS food_id,
        admin.food_name AS food_name,
        admin.description AS description,
        admin.price AS price,
        admin.offer AS offer,
        admin.tags AS tags,
        admin.image AS image,
        admin.calories AS calories,
        admin.duration AS duration,
        food_ratings.rating AS rating,
        food_ratings.review AS review
      FROM admin
      LEFT JOIN food_ratings ON admin.food_id = food_ratings.food_id
    `);

    // Group the results by food_id to include multiple ratings/reviews for each food item
    const foodItems = food.rows.reduce((acc, row) => {
      const existingFood = acc.find(item => item.food_id === row.food_id);
      if (existingFood) {
        // Add the review and rating to the existing food item
        existingFood.reviews.push({ rating: row.rating, review: row.review });
      } else {
        // Add a new food item with reviews and ratings
        acc.push({
          food_id: row.food_id,
          food_name: row.food_name,
          description: row.description,
          price: row.price,
          image: row.image,
          offer: row.offer,
          tags: row.tags,
          duration:row.duration,
          calories:row.calories,
          reviews: row.rating ? [{ rating: row.rating, review: row.review }] : []
        });
      }
      return acc;
    }, []);

    // Calculate the total number of reviews and the average rating for each food item
    const updatedFoodItems = foodItems.map(foodItem => {
      const totalReviews = foodItem.reviews.length;
      const averageRating = totalReviews
        ? foodItem.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0; // If no reviews, average rating is 0

      return {
        ...foodItem,
        reviewsCount: totalReviews, // Add review count
        averageRating: averageRating.toFixed(2) // Round the average to 2 decimal places
      };
    });

    console.log("Food items with reviews count and average rating:", updatedFoodItems);
    // Return the response with food items, reviews count, and average rating
    return res.json(updatedFoodItems);

  } catch (error) {
    console.error("Error fetching food:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



const getFoodById = async (req, res) => {
  const { id } = req.params;
  console.log("id that is got is ", id);
  const { food } = req;
  if (parseInt(id) !== food.id) {
    return res
      .status(403)
      .json({ error: "You are not authorized to view this profile" });
  }
  try {
    const food = await pool.query("SELECT * FROM admin WHERE food_id = $1", [
      id,
    ]);
    if (food.rows.length === 0) {
      return res.status(404).json({ error: "No food found for this id" });
    }
    res.json(food.rows);
  } catch (error) {
    console.error("Error fetching food:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateFood = async (req, res) => {
  const { foodname, price, offer, description, tags } = req.body;
  const { id } = req.params;

  console.log("Request Body:", req.body);
  if (!foodname) {
    return res.status(400).json({ error: "Please provide the food name" });
  }
  if (!price) {
    return res.status(400).json({ error: "Please provide the price" });
  }
  if (!offer) {
    return res.status(400).json({ error: "Please provide an offer" });
  }
  if (!description) {
    return res.status(400).json({ error: "Please provide a description" });
  }
  if (!tags) {
    return res.status(400).json({ error: "Please provide tags" });
  }

  const image = req.file ? `/uploads/foodimage/${req.file.filename}` : null;
  try {
    const food = await pool.query("SELECT * FROM admin WHERE food_id = $1", [
      id,
    ]);
    if (food.rows.length === 0) {
      return res.status(404).json({ error: "Food not found" });
    }

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

    // Add updated_at field for timestamp tracking
    queryFields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Ensure the food ID is used in the WHERE clause
    values.push(id);

    // Finalize the query
    const query = `
      UPDATE admin
      SET ${queryFields.join(", ")}
      WHERE food_id = $${values.length}
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
const deleteFood = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await pool.query("SELECT * FROM admin WHERE food_id = $1", [
      id,
    ]);
    if (food.rows.length === 0) {
      return res.status(404).json({ error: "Food not found" });
    }
    const result = await pool.query("DELETE FROM admin WHERE food_id = $1", [
      id,
    ]);
    return res.json({ message: "was deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const foodRating =async(req,res)=>{
  const { food_id, user_id, rating, review } = req.body;
  console.log("food rating",{food_id, user_id, rating, review})
  if (!food_id || !user_id || !rating) {
    return res.status(400).json({ message: "Food ID, User ID, and rating are required." });
}
if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
}
try {
  const result = await pool.query(
      'INSERT INTO food_ratings (food_id, user_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING *',
      [food_id, user_id, rating, review]
  );
  res.status(201).json({
      message: 'Food rating created successfully',
      rating: result.rows[0]
  });
} catch (err) {
  console.error('Error creating food rating:', err);
  res.status(500).json({ message: 'Server error' });
}
}

module.exports = { addFood, getFood, updateFood, deleteFood,getFoodById,foodRating };
