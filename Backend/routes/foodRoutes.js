const express = require ("express");
const router =express.Router();
const multer = require('multer');
const {addFood,getFood,updateFood, deleteFood } = require("../controllers/addFoodController")
const upload = multer({ dest: "uploads/foodimage" });
const updated =multer({dest:"uploads/foodimage"})
const { authenticate } = require('../middleware/authentication');

router.put('/food', authenticate, upload.single("image"),addFood );
router.get("/menu",authenticate,getFood)
router.put("/:id",authenticate, updated.single("image"),updateFood)
router.delete("/:id/delete",authenticate,deleteFood)
module.exports = router;