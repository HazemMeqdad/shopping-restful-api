const express = require("express");
const checkAuth = require("../middleware/check-auth.js")
const OrderController =  require("../controllers/orders")

const router = express.Router();

router.get("/", checkAuth, OrderController.get_all_orders)

router.post("/", checkAuth, OrderController.post_new_order)

router.get("/:orderId", checkAuth, OrderController.get_order)

router.delete("/:orderId", checkAuth, OrderController.delete_order)

module.exports = router;
