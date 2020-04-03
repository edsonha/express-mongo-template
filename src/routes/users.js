require("../models/users.model");
const mongoose = require("mongoose");
const User = mongoose.model("user");
const express = require("express");
const usersRouter = express.Router();

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (foundUser.password === password) {
      res.status(200).json({
        name: foundUser.name,
        books: foundUser.books
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
