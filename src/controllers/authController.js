const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const users = [
  { username: "admin", password: bcrypt.hashSync("admin123", 10) },
  { username: "gourav", password: bcrypt.hashSync("grv123", 10) },
  { username: "testuser", password: bcrypt.hashSync("test123", 10) }
];


// Login User & Generate JWT Token
const { Category } = require("../model/category");
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password are required" });
    // Find User in DB or Predefined List

    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    // Get all categories
    
   
    //TODO along with token , send the information about all the id and name of all the categories
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
