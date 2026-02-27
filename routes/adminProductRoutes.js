const express = require("express");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/adminProductController");
const router = express.Router()

router.route("/").post(createProduct);
router.route("/:id").put(updateProduct);
router.route("/:id").delete(deleteProduct);

module.exports = router;