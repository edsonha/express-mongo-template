require("dotenv").config();
const app = require("./app");
// const PORT = process.env.PORT;

app.listen(process.env.PORT, () => {
  console.log(`Express server is listening on PORT ${process.env.PORT}`);
});
