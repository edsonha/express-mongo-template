const mongoose = require("mongoose");
const { books } = require("./mockBooks");
const braveNewWorldBook = books[1];
const fahrenheitBook = books[2];

const users = [
  {
    _id: mongoose.Types.ObjectId("5d2e85951b62fc093cc3318b"),
    name: "John",
    email: "john@gmail.com",
    password: "abc",
    books: [braveNewWorldBook]
  },
  {
    _id: mongoose.Types.ObjectId("7d2e85951b62fc093cc3319b"),
    name: "Bob",
    email: "bob@gmail.com",
    password: "123",
    books: [braveNewWorldBook, fahrenheitBook]
  }
];

module.exports = { users };
