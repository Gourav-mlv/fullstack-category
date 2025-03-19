const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
   children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
}, { timestamps: true });

module.exports = mongoose.model("Categories", CategorySchema);