const express = require("express");
const { errorHandler } = require("./middleware/errorhandler");
const connectDB = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");

connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", require("./routes/productRoutes"));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on PORT ${port}`);
});