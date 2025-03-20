const mongoose = require("mongoose");
const logger = require('./log').getLogger('Config/DB');
// Establishes a connection to the MongoDB database.
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });
    return connection.connection;
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;