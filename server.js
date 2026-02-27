const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");

connectDB();
const app = express();
app.set("trust proxy", 1);
// 🔒 Global Rate Limiter (30 requests per minute per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 25, // limit each IP to 30 requests per window
  message: {
    message: "Too many requests. Please try again in a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const port = process.env.PORT || 5000;

// --- FIX: UPDATE CORS CONFIGURATION ---
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser()); // Required to read the secure cookie
app.use(express.json());
app.use(limiter);

// --- 2. ADMIN AUTHENTICATION LOGIC ---

// Middleware to protect routes
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.admin_token; // Read cookie automatically
  if (!token) return res.status(401).json({ message: "Not Authenticated" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
    );
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

// Admin Login Route
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  // QUICKEST WAY: Hardcode admin credentials in .env or here
  // Ideally, compare with hashed password in DB
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  

  if (username === adminUser && password === adminPass) {
    // Generate Token
    const token = jwt.sign(
      { role: "admin", username },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" },
    );

    // Set Secure Cookie
    // res.cookie("admin_token", token, {
    //     httpOnly: true, // Frontend cannot access this (XSS Proof)
    //     secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    //     sameSite: "strict", // CSRF Protection
    //     maxAge: 24 * 60 * 60 * 1000 // 1 Day
    // });
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: true, // REQUIRED for sameSite none
      sameSite: "none", // REQUIRED for cross-domain
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successful" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// Admin Logout Route
app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ message: "Logged out" });
});

// Admin Check Route (Use this in React to check if logged in)
app.get("/api/admin/check", verifyAdmin, (req, res) => {
  res.json({ loggedIn: true, user: req.admin.username });
});

// --- 3. EXISTING ROUTES ---

// If you want to protect product creation/deletion, wrap them like this:
// app.use("/api/products", verifyAdmin, require("./routes/productRoutes"));
// OR keep them public:
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/invoice-request", require("./routes/saleRoutes"));
app.use("/api/get-sales", require("./routes/saleRoutes"));

app.use(
  "/api/admin/products",
  verifyAdmin,
  require("./routes/adminProductRoutes"),
);
app.use("/api/admin/sales", verifyAdmin, require("./routes/adminSaleRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
  console.log(process.env.ADMIN_PASSWORD);
  console.log(process.env.ADMIN_USERNAME);
});
