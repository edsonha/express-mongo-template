const express = require("express");
const usersRouter = express.Router();
const { users } = require("../../data/mockUsers");

usersRouter.get("/", (req, res, next) => {
  res.status(200).json(users);
});

module.exports = usersRouter;
