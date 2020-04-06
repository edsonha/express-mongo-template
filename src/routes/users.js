require("../models/users.model");
const mongoose = require("mongoose");
const User = mongoose.model("user");
const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcryptjs");

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      res.status(401).json({ message: "Wrong credentials" });
    }

    const isUser = await bcrypt.compare(password, foundUser.password);

    if (isUser) {
      res.status(200).json({
        name: foundUser.name,
        books: foundUser.books,
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
      const saltRound = 10;
      const digest = await bcrypt.hash(password, saltRound);
      const userWithDigest = { name, email, password: digest };
      await User.create(userWithDigest);
      res.status(201).json({ message: "Account created" });
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findById(id);
    const { name, books } = foundUser;
    res.status(200).json({ name, books });
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
