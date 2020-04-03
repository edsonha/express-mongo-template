require("../models/users.model");
const mongoose = require("mongoose");
const User = mongoose.model("user");
const express = require("express");
const usersRouter = express.Router();

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      res.status(401).json({ message: "Wrong credentials" });
    }

    if (foundUser.password === password) {
      res.status(200).json({
        name: foundUser.name,
        books: foundUser.books
      });
    } else {
      res.status(401).json({ message: "Wrong password" });
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    if (password !== passwordConfirmation) {
      res.status(400).json({ message: "Password does not match" });
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(400).json({ message: "User already exists" });
    } else {
      await User.create({ name, email, password });
      const newUser = await User.findOne({ email });
      res.status(201).json({
        message: "Account created",
        name: newUser.name,
        books: newUser.books
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
