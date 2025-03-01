const express = require("express");
const {putorderitems,getorderitems} = require("../controllers/orderItemsController"); // Ensure this is correctly required
const { authenticate } = require("../middleware/authentication");
const router = express.Router();


router.put("/orderitems", authenticate, putorderitems);
router.get("/:id/orderitems", authenticate, getorderitems);
module.exports = router;
