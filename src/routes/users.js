const express = require("express");
const usersRouter = express.Router();
const { findAll } = require("../controllers/users.controller");

usersRouter.get("/", findAll);

module.exports = usersRouter;
