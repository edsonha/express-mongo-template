const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true }
});

mongoose.model("book", bookSchema);
