const express = require("express");
const router = express.Router();
const salesController = require("../controllers/saleControllerv1");

router.post("/", salesController.addSale);
router.get("/", salesController.getSales);

module.exports = router;