const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/products")

const checkAuth = require("../middleware/check-auth.js")

router.get("/", ProductController.get_all_products)

router.post("/", checkAuth, ProductController.post_new_product)

router.get("/:productId", ProductController.get_product)

router.patch("/:productId", checkAuth, ProductController.patch_product)

router.delete("/:productId", checkAuth, ProductController.delete_product)

module.exports = router;