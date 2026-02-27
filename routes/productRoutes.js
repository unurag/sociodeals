const express = require("express");
const router = express.Router()
const  { getProduct } = require("../controllers/productController")
router.route("/").get(getProduct);

module.exports = router;