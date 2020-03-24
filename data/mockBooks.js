const mongoose = require("mongoose");

const books = [
  {
    _id: mongoose.Types.ObjectId("5d2e85951b62fc093cc3318b"),
    title: "1984",
    author: "George Orwell"
  },
  {
    _id: mongoose.Types.ObjectId("7d2e85951b62fc093cc3319b"),
    title: "Brave New World",
    author: "Aldous Huxley"
  },
  {
    _id: mongoose.Types.ObjectId("5e784e071292de616c5bc987"),
    title: "Fahrenheit 451",
    author: "Ray Bradbury"
  }
];

module.exports = { books };
