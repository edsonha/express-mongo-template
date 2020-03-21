const { books } = require("../../data/mockBooks.json");

const findAll = (req, res, next) => {
  try {
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

const searchOne = (req, res, next) => {
  try {
    const { id } = req.params;
    const foundBook = books.find(book => book.id === id);
    if (foundBook) {
      res.status(200).json(foundBook);
    } else {
      res.status(404).json({ message: `Unable to find book with id: ${id}` });
    }
  } catch (err) {
    next(err);
  }
};

const deleteOne = (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBook = books.find(book => book.id === id);
    if (deletedBook) {
      const deletedIndex = books.indexOf(deletedBook);
      books.splice(deletedIndex, 1);
      res.status(200).json(deletedBook);
    } else {
      res.status(404).json({ message: `Unable to delete book with id: ${id}` });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { findAll, searchOne, deleteOne };
