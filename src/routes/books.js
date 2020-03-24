const express = require("express");
const booksRouter = express.Router();
const Ctrl = require("../controllers/books.controller");

booksRouter.get("/", Ctrl.findAll);
booksRouter.get("/:id", Ctrl.searchOne);
booksRouter.delete("/:id", Ctrl.deleteOne);
booksRouter.post("/", Ctrl.createOne);
booksRouter.put("/:id", Ctrl.updateOne);

module.exports = booksRouter;
