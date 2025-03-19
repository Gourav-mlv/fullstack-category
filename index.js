require('dotenv').config();
const route = require('./src/routes/categoryRoute');
const authRoute = require('./src/routes/authRoutes');
const  express = require('express');
const connectDB = require('./src/config/db');
const logger = require('./src/config/log');
app = express();
app.use(express.json());
app.use(route);
app.use(authRoute);


const startServer = async () => {
  let connection = await connectDB(); // Ensure DB connection before starting the server
  const PORT = process.env.PORT || 6900;
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
};

startServer();