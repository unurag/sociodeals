const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel"); // FIX: Changed variable name to 'Product'

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("No data received");
  }
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product removed" });
});

module.exports = { createProduct, updateProduct, deleteProduct };