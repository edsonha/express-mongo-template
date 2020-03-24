require("../models/books.model");
const mongoose = require("mongoose");
const Book = mongoose.model("book");

const findAll = async (req, res, next) => {
  try {
    const bookList = await Book.find();
    res.status(200).json(bookList);
  } catch (err) {
    next(err);
  }
};

const searchOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundBook = await Book.findById(id);
    if (foundBook) {
      res.status(200).json(foundBook);
    } else {
      res.status(404).json({ message: `Unable to find book with id: ${id}` });
    }
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (deletedBook) {
      res.status(200).json(deletedBook);
    } else {
      res.status(404).json({ message: `Unable to delete book with id: ${id}` });
    }
  } catch (err) {
    next(err);
  }
};

const createOne = async (req, res, next) => {
  try {
    const newBook = req.body;
    const { title, author } = newBook;
    const foundDuplicateBook = await Book.findOne({ title: title });
    if (foundDuplicateBook && foundDuplicateBook.author === author) {
      res.status(422).json({
        message: "Unable to create. Matching title and author detected"
      });
    } else {
      await Book.create(newBook);
      res.status(201).json(newBook);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { findAll, searchOne, deleteOne, createOne };
