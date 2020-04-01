require("./utils/db");
const express = require("express");
const app = express();
const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//   res.status(200).json("Welcome to Express Mongoose Backend template");
// });

app.use("/books", booksRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
