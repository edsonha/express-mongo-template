const mongoose = require("mongoose");
const { books } = require("./mockBooks");
const braveNewWorldBook = books[1];

const users = [
  {
    _id: mongoose.Types.ObjectId("5d2e85951b62fc093cc3318b"),
    name: "John",
    email: "john@gmail.com",
    password: "$2a$10$VvHAbEKS/AvUnBVe/saTKeMtcuMbGHU8U6RLXygck6YdqjDhyrLVi",
    books: [braveNewWorldBook],
  },
  {
    _id: mongoose.Types.ObjectId("7d2e85951b62fc093cc3319b"),
    name: "Bob",
    email: "bob@gmail.com",
    password: "$2a$10$7.1XC32mTNFYRDT7hngTlO5ED1AI1oaiQ7bgBY6XrgFvkEyJSXODa",
    books: books,
  },
];

module.exports = { users };
