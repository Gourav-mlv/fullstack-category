const mongoose = require("mongoose");
/**
 * Connect to the MongoDB database.
 * @returns {Promise<mongoose.Connection>} - The MongoDB connection object.
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });
    return connection.connection;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;