const express = require("express");
const router = express.Router();
const salesController = require("../controllers/saleController");

// DELETE Sale (Protected)
router.delete("/:id", salesController.deleteSale);

module.exports = router;