require('dotenv').config();
const route = require('./src/routes/categoryRoute');
const authRoute = require('./src/routes/authRoutes');
const  express = require('express');
const connectDB = require('./src/config/db');
const logger = require('./src/config/log').getLogger('Index');
app = express();
app.use(express.json());
app.use(route);
app.use(authRoute);

const path = require("path");

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

 // Ensure DB connection before starting the server

connectDB();
const PORT = process.env.PORT || 6900;
const server =  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
module.exports = { app, server };