const express = require("express");
const booksRouter = express.Router();
const { books } = require("../../data/mockBooks.json");

booksRouter.get("/", (req, res, next) => {
  res.status(200).json(books);
});

module.exports = booksRouter;
