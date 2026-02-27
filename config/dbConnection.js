const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      serverSelectionTimeoutMS: 5000, // fail fast (default is 30s)
      socketTimeoutMS: 45000,
      family: 4, // 🔥 force IPv4 (important for DO + Atlas)
    });

    console.log(
      "Database connected",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;