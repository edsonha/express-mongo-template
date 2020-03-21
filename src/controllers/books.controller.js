const { books } = require("../../data/mockBooks.json");

const findAll = (req, res, next) => {
  try {
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

module.exports = { findAll };
