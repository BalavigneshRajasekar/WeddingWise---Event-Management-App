const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

//files
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const budgetRouter = require("./routes/budget");
const mallsRouter = require("./routes/malls");
const decorRouter = require("./routes/decoration");
const cateringRouter = require("./routes/catering");
const djRouter = require("./routes/dj");

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

//Routes
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/malls", mallsRouter);
app.use("/api/decorations", decorRouter);
app.use("/api/catering", cateringRouter);
app.use("/api/dj", djRouter);

mongoose.connect(process.env.MONGODB).then(() => {
  console.log("Database Connected");
  app.listen("3000", () => {
    console.log("Server is running on port 3000");
  });
});
