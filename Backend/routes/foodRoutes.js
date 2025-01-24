const express = require ("express");
const router =express.Router();
const multer = require('multer');
const {addFood,getFood,updateFood } = require("../controllers/addFoodController")
const upload = multer({ dest: "uploads/foodimage" });
const { authenticate } = require('../middleware/authentication');

router.put('/food', authenticate, upload.single("image"),addFood );
router.get("/menu",authenticate,getFood)
router.put("/:id",authenticate,updateFood)
module.exports = router;