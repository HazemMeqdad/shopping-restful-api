const express = require("express");
const UserController = require("../controllers/user")

const router = express.Router();


router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login)

router.delete("/:userId", UserController.delete_user)

module.exports = router;
