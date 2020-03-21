const { users } = require("../../data/mockUsers");

const findAll = (req, res, next) => {
  try {
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { findAll };
