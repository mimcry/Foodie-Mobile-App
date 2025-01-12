import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1/foodie")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

  const tagSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String
  });
  
  const foodSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    image: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    price: Number,
    offer: Boolean,
    offerPer: Number,
    sides: [
      {
        name: String,
        price: Number
      }
    ],
    drinks: [
      {
        name: String,
        price: Number
      }
    ],
    ingredients: [String]
  });
  

  const orderSchema = new mongoose.Schema({
    id: Number,
    foodName: String,
    quantity: { type: Number, default: 1 },
    selectedSides: [String],
    selectedSidesPrices: [Number],
    selectedDrinks: [String],
    selectedDrinksPrices: [Number],
    price: Number,
    description: String,
    image: String,
    orderedDate: { type: Date, default: Date.now },
    region: String,
    area: String,
    mobileNumber: String,
    landmark: String,
    notesTextInput: String
  });
  

const orderCountSchema = new mongoose.Schema({
  id: Number,
  foodName: String,
  count: { type: Number, default: 0 },
});
const addressSchema = new mongoose.Schema({
  region: String,
  area: String,
  mobileNumber: String,
  landmark: String,
  isDefault: Boolean
});


const Food = mongoose.model("Food", foodSchema);
const Order = mongoose.model("Order", orderSchema);
const OrderCount = mongoose.model("OrderCount", orderCountSchema);
const Tag = mongoose.model('Tag', tagSchema);
const Address = mongoose.model("Address", addressSchema);


const tags = [
  { id: 1, name: 'Coffee', image: path.join(__dirname, 'images/tagimage/coffee.png') },
  { id: 2, name: 'Fastfood', image: path.join(__dirname, 'images/tagimage/fastfood.png') },
  { id: 3, name: 'Pizza', image: path.join(__dirname, 'images/tagimage/pizzal.png') },
  { id: 4, name: 'Momo', image: path.join(__dirname, 'images/tagimage/momo.png') },
  { id: 5, name: 'Noodles', image: path.join(__dirname, 'images/tagimage/ramen.png') },
  { id: 6, name: 'Breakfast', image: path.join(__dirname, 'images/tagimage/Breakfast.png') }
];
const foodItems = [
  {
      id: 1,
      name: "Chicken Momo",
      description: "Steamed dumplings filled with minced chicken and spices",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAIrmVV-U3uth9y0beOshLdlI6fnKqFDhhxnsRFdnl3w&s",
      tags: [4, 2],
      price: 120,
      offer: true,
      offerPer: 10,
      sides: [
          { name: "Spring Rolls", price: 120 },
          { name: "Salad", price: 100 },
          { name: "Soup", price: 100 }
      ],
      drinks: [
          { name: "Iced Tea", price: 120 },
          { name: "Lemonade", price: 50 },
          { name: "Water", price: 20 }
      ],
      ingredients: [
          "Minced chicken",
          "Dumpling wrappers",
          "Ginger",
          "Garlic",
          "Onion",
          "Salt",
          "Pepper",
          "Soy sauce"
      ]
  },
  {
      id: 2,
      name: "Veg Chowmein",
      description: "Stir-fried noodles with mixed vegetables and spices",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZu1vp9OYM5Mj173dwR8Qy9Qa34ZcsLqNmvflXcgFzOA&s",
      tags: [5, 2],
      price: 150,
      offer: false,
      sides: [
          { name: "Spring Rolls", price: 120 },
          { name: "Vegetable Dumplings", price: 100 },
          { name: "Cucumber Salad", price: 80 }
      ],
      drinks: [
          { name: "Green Tea", price: 40 },
          { name: "Soda", price: 50 },
          { name: "Lemonade", price: 50 },
          { name: "Water", price: 25 }
      ],
      ingredients: [
          "Noodles",
          "Mixed vegetables (e.g., carrots, cabbage, bell peppers)",
          "Ginger",
          "Garlic",
          "Soy sauce",
          "Vegetable oil",
          "Salt",
          "Pepper"
      ]
  },
  {
      id: 3,
      name: "Espresso",
      description: "Strong black coffee made by forcing hot water through finely-ground coffee beans",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3sswmr2jT3q8OCL6jb-KR-9vqrYfBCTMEfJXv64gQ6A&s",
      tags: [1, 6],
      price: 100,
      offer: true,
      offerPer: 15,
      sides: [
          { name: "Biscotti", price: 120 },
          { name: "Chocolate", price: 100 },
          { name: "Croissant", price: 100 }
      ],
      drinks: [
          { name: "Water", price: 20 },
          { name: "Amaro", price: 50 },
          { name: "Fresh Juice", price: 80 }
      ],
      ingredients: [
          "Finely-ground coffee beans",
          "Hot water"
      ]
  },
  {
      id: 4,
      name: "Thukpa",
      description: "Spicy Tibetan noodle soup with vegetables or meat",
      image: "https://images.slurrp.com/prodrich_article/stl221ehtz.webp?impolicy=slurrp-20210601&width=880&height=500",
      tags: [5, 6],
      price: 180,
      offer: false,
      sides: [
          { name: "Momos", price: 100 },
          { name: "Spring Rolls", price: 120 },
          { name: "Pickled Vegetables", price: 80 }
      ],
      drinks: [
          { name: "Herbal Tea", price: 40 },
          { name: "Water", price: 20 },
          { name: "Lemonade", price: 50 }
      ],
      ingredients: [
          "Noodles",
          "Vegetables (e.g., carrots, cabbage, bell peppers)",
          "Meat (optional)",
          "Ginger",
          "Garlic",
          "Soy sauce",
          "Chili sauce",
          "Salt",
          "Pepper"
      ]
  },
  {
      id: 5,
      name: "Margherita Pizza",
      description: "Classic pizza topped with tomato sauce, mozzarella cheese, and fresh basil",
      image: "https://www.southernliving.com/thmb/3x3cJaiOvQ8-3YxtMQX0vvh1hQw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2652401_QFSSL_SupremePizza_00072-d910a935ba7d448e8c7545a963ed7101.jpg",
      tags: [3, 2],
      price: 200,
      offer: true,
      offerPer: 20,
      sides: [
          { name: "Garlic Bread", price: 100 },
          { name: "Caesar Salad", price: 150 },
          { name: "Mozzarella Sticks", price: 120 }
      ],
      drinks: [
          { name: "Red Wine", price: 180 },
          { name: "Beer", price: 150 },
          { name: "Soda", price: 50 },
          { name: "Water", price: 20 }
      ],
      ingredients: [
          "Pizza dough",
          "Tomato sauce",
          "Mozzarella cheese",
          "Fresh basil",
          "Olive oil",
          "Salt",
          "Pepper"
      ]
  },
  {
      id: 6,
      name: "Veggie Burger",
      description: "Grilled veggie patty with lettuce, tomato, onion, and sauce in a sesame seed bun",
      image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_400/972a37599772cdc7df93a0855ad87591",
      tags: [2],
      price: 180,
      offer: false,
      sides: [
          { name: "Fries", price: 80 },
          { name: "Onion Rings", price: 70 },
          { name: "Coleslaw", price: 60 }
      ],
      drinks: [
          { name: "Soda", price: 50 },
          { name: "Milkshake", price: 100 },
          { name: "Iced Tea", price: 120 },
          { name: "Water", price: 20 }
          ],
          ingredients: [
          "Veggie patty",
          "Lettuce",
          "Tomato",
          "Onion",
          "Sesame seed bun",
          "Sauce (e.g., ketchup, mayo)",
          "Salt",
          "Pepper"
          ]
          },
          {
          id: 7,
          name: "Chicken Chowmein",
          description: "Stir-fried noodles with chicken, vegetables, and savory sauce",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStw-K2zmxZULaBiEkJB0nE2Ar4iFC1Lc-TVuICtBd9Pw&s",
          tags: [5, 2],
          price: 170,
          offer: true,
          offerPer: 10,
          sides: [
          { name: "Spring Rolls", price: 120 },
          { name: "Fried Wontons", price: 100 },
          { name: "Cucumber Salad", price: 80 }
          ],
          drinks: [
          { name: "Green Tea", price: 40 },
          { name: "Soda", price: 50 },
          { name: "Lemonade", price: 50 },
          { name: "Water", price: 25 }
          ],
          ingredients: [
          "Chicken",
          "Noodles",
          "Mixed vegetables (e.g., carrots, cabbage, bell peppers)",
          "Ginger",
          "Garlic",
          "Soy sauce",
          "Vegetable oil",
          "Salt",
          "Pepper"
          ]
          },
          {
          id: 8,
          name: "Cappuccino",
          description: "Espresso mixed with hot milk and topped with foamed milk",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2DgcTMWetlhLu_XGvCk2i8uqtrGZl_wH1uEk4MzaHhw&s",
          tags: [1, 6],
          price: 120,
          offer: false,
          sides: [
          { name: "Biscotti", price: 120 },
          { name: "Muffins", price: 100 },
          { name: "Croissant", price: 100 }
          ],
          drinks: [
          { name: "Water", price: 20 },
          { name: "Orange Juice", price: 80 },
          { name: "Herbal Tea", price: 40 }
          ],
          ingredients: [
          "Espresso",
          "Hot milk",
          "Foamed milk"
          ]
          },
          {
          id: 9,
          name: "Veg Momos",
          description: "Steamed dumplings filled with mixed vegetables and spices",
          image: "https://resize.indiatvnews.com/en/resize/oldbucket/1200_-/lifestylelifestyle/IndiaTv94add1_Momos-main-pic.jpg",
          tags: [4, 2],
          price: 100,
          offer: false,
          sides: [
          { name: "Spring Rolls", price: 120 },
          { name: "Pickled Vegetables", price: 80 },
          { name: "Salad", price: 100 }
          ],
          drinks: [
          { name: "Iced Tea", price: 120 },
          { name: "Lemonade", price: 50 },
          { name: "Water", price: 20 }
          ],
          ingredients: [
          "Mixed vegetables (e.g., cabbage, carrots, bell peppers)",
          "Dumpling wrappers",
          "Ginger",
          "Garlic",
          "Onion",
          "Salt",
          "Pepper",
          "Soy sauce"
          ]
          },
          {
          id: 10,
          name: "Chicken Chowder",
          description: "Creamy chicken soup with vegetables and herbs",
          image: "https://www.barleyandsage.com/wp-content/uploads/2021/12/chicken-corn-chowder-1200x1200-1.jpg",
          tags: [6],
          price: 150,
          offer: true,
          offerPer: 15,
          sides: [
          { name: "Bread Rolls", price: 100 },
          { name: "Garlic Bread", price: 100 },
          { name: "Side Salad", price: 120 }
          ],
          drinks: [
          { name: "White Wine", price: 180 },
          { name: "Lemonade", price: 50 },
          { name: "Water", price: 20 }
          ],
          ingredients: [
          "Chicken",
          "Potatoes",
          "Carrots",
          "Celery",
          "Onion",
          "Chicken broth",
          "Cream",
          "Herbs (e.g., thyme, parsley)",
          "Salt",
          "Pepper"
          ]
          }
          ];
          async function initializeTags() {
            try {
              const count = await Tag.countDocuments();
              if (count === 0) {
                await Tag.insertMany(tags);
                console.log("Tags inserted into the database", tags);
              } else {
                console.log("Tags already exist in the database");
              }
            } catch (error) {
              console.error("Error initializing tags:", error);
            }
          }
          
          async function initializeFoodItems() {
            try {
              const tagMap = await Tag.find().lean().exec();
              const tagIdMap = tagMap.reduce((acc, tag) => {
                acc[tag.id] = tag._id;
                return acc;
              }, {});
              
              const count = await Food.countDocuments();
              if (count === 0) {
                await Food.insertMany(foodItems.map(item => ({
                  ...item,
                  tags: item.tags.map(tag => tagIdMap[tag]) 
                })));
                console.log("Food items inserted into the database", foodItems);
              } else {
                console.log("Food items already exist in the database");
              }
            } catch (error) {
              console.error("Error initializing food items:", error);
            }
          }
          
         
          initializeTags().then(initializeFoodItems);
          


initializeTags();






app.get("/food", async (req, res) => {
  try {
    const food = await Food.find().populate('tags');
    res.json(food);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find();
   
    const tagsWithImages = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      image: `http://localhost:9002//images/tagimage/${encodeURIComponent(path.basename(tag.image))}`,
      foods: tag.foods,
      _id:tag._id
    }));
    
    res.json(tagsWithImages);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/order", async (req, res) => {
  try {
    const { orderDetails, additionalNotes, defaultAddressDetails } = req.body; 
    const createdOrders = [];

    for (const order of orderDetails) {
      const {
        id,
        foodName,
        quantity,
        selectedSides,
        selectedSidesPrices,
        selectedDrinks,
        selectedDrinksPrices,
        price,
        description,
        image
      } = order;

      
      const { region, area, landmark, mobileNumber } = defaultAddressDetails;

      const newOrder = new Order({
        id,
        foodName,
        quantity,
        selectedSides,
        selectedSidesPrices,
        selectedDrinks,
        selectedDrinksPrices,
        price,
        description,
        image,
        region,
        area,
        mobileNumber,
        landmark,
        notesTextInput: additionalNotes
      });

      await newOrder.save();
      createdOrders.push(newOrder);

      let orderCount = await OrderCount.findOne({ id });
      if (orderCount) {
        orderCount.count += quantity;
        await orderCount.save();
      } else {
        orderCount = new OrderCount({ id, foodName, count: quantity });
        await orderCount.save();
      }

      console.log(`Ordered: ${quantity} ${foodName}(s) for ${price}`);
      console.log(`Notes: ${additionalNotes}`);
      console.log(`Address: ${JSON.stringify({ region, area, mobileNumber, landmark })}`);
    }

    res.status(201).json({ message: "Orders placed successfully", orders: createdOrders });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/order-history", async (req, res) => {
  try {
    const orderHistory = await Order.find();
    res.json(orderHistory);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/popular-food", async (req, res) => {
  try {
    const foodWithCounts = await Food.aggregate([
      {
        $lookup: {
          from: "ordercounts", 
          localField: "id",    
          foreignField: "id",
          as: "orderCount"
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          description: 1,
          image: 1,
          tags: 1,
          price: 1,
          offer: 1,
          offerPer: 1,
          sides: 1,
          drinks: 1,
          ingredients: 1,
          orderCount: { $sum: "$orderCount.count" } 
        }
      },
      {
        $sort: { orderCount: -1 } 
      },
      {
        $limit: 6
      }
    ]);

    res.json(foodWithCounts);
    console.log("count",foodWithCounts)
  } catch (error) {
    console.error("Error fetching popular food:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/addresses", async (req, res) => {
  try {
   
    const addresses = await Address.find();
   
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/saveaddress", async (req, res) => {
  try {
    const { region, area, mobileNumber, landmark, isDefault } = req.body;

   
    if (isDefault) {
      await Address.updateOne({ isDefault: true }, { $set: { isDefault: false } });
    }
    

    const newAddress = new Address({ region, area, mobileNumber, landmark, isDefault });
    
   
    await newAddress.save();
    
    res.status(201).json({ message: "Address saved successfully", address: newAddress });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/set-default-address", async (req, res) => {
  try {
    const { id } = req.body;

    await Address.updateMany({}, { $set: { isDefault: false } });

  
    await Address.findByIdAndUpdate(id, { $set: { isDefault: true } });

    res.status(200).json({ message: "Default address set successfully" });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.listen(9002, () => {
  console.log("Backend server started at port 9002");
});
