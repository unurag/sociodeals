const asyncHandler = require("express-async-handler");
const Products = require("../models/productModel");

//@desc Get paginated + filtered accounts
//@route GET /api/products
//@access public
const getProduct = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const filters = {};

  // category filter
  if (req.query.category) {
    filters.tag = { $in: req.query.category.split(",") };
  }

  // age filter
  if (req.query.age) {
    const ageRanges = req.query.age.split(",");

    filters.$or = ageRanges.map((range) => {
      const [min, max] = range.split("-").map(Number);
      return { age: { $gte: min, $lte: max } };
    });
  }

if (req.query.posts) {
  const postRanges = req.query.posts.split(",");

  const postConditions = postRanges.map(range => {
    if (range.includes("+")) {
      const min = parseInt(range);
      return { posts: { $gte: min } };
    }

    const [min, max] = range.split("-").map(Number);
    return { posts: { $gte: min, $lte: max } };
  });

  filters.$and = [
    ...(filters.$and || []),
    { $or: postConditions }
  ];
}



  // sorting
  let sort = {};
  if (req.query.sort === "price_asc") sort.price = 1;
  if (req.query.sort === "price_desc") sort.price = -1;
  if (req.query.sort === "followers_desc") sort.followers = -1;

  const total = await Products.countDocuments(filters);

  const productsVar = await Products.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    total,
    page,
    pages: Math.ceil(total / limit),
    data: productsVar,
  });
});

module.exports = { getProduct };
