const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

//files
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const mallsRouter = require("./routes/malls");

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/malls", mallsRouter);

mongoose.connect("mongodb://localhost:27017/Event-Management").then(() => {
  console.log("Database Connected");
  app.listen("3000", () => {
    console.log("Server is running on port 3000");
  });
});
