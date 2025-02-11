const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// THIS WILL ALLOW US TO CONNECT TO MONGOOSE via OUR .ENV
app.use(express.static("public"));

// when I npm start i get Mongo parse error: the "uses" below are no longer supported will comment out to see if it will rrun properly this way
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/budget',
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  }
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes here
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
