const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const uploadsPath = path.join(__dirname, "uploads", "avatars");
const authRoutes = require("./routes/authRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const profileRouter = require("./routes/profileRoutes");
const contactRouter = require("./routes/contactRoutes");
const foodRouter = require("./routes/foodRoutes");
const orderitemdRouter=require("./routes/orderItemsRoutes")
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", weatherRoutes);
app.use("/profile", profileRouter);
app.use("/contactus", contactRouter);
app.use("/fooddetails", foodRouter);
app.use("/",orderitemdRouter)
// Refresh token route
app.post("/refresh-token", async (req, res) => {
  console.log(req.body);
  const refreshToken = req.body.token; // Get refresh token from request body
  // const ref reshToken = req.cookies.refresh_token; // Get refresh token from cookie

  // if (!refreshToken) {
  //   return res.status(401).json({ error: "Refresh token missing" });
  // }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Optionally: Check if refresh token exists in the database for invalidation
    // If valid, generate a new access token
    const accessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      JWT_SECRET,
      { expiresIn: "1h" } // New access token expires in 1 hour
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});
// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token, // Send notification to a specific user
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

// API Endpoint to Send Notification
app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;
  
  if (!token || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await sendNotification(token, title, body);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: "Failed to send notification" });
  }
});


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
