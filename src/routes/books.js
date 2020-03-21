const express = require("express");
const booksRouter = express.Router();
const Ctrl = require("../controllers/books.controller");

booksRouter.get("/", Ctrl.findAll);

module.exports = booksRouter;
