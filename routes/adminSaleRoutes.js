const express = require("express");
const router = express.Router();
const salesController = require("../controllers/saleControllerv1");

// DELETE Sale (Protected)
router.delete("/:id", salesController.deleteSale);

module.exports = router;