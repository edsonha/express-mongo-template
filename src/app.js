const express = require("express");
const app = express();
const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Welcome to Express Mongoose Backend template");
});

app.use("/books", booksRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
