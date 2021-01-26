const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const assert = require("assert");
const events = require("events");

dotenv.config();

const app = express();
const whitelist = ["http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin)
      return callback(null, true);
    return callback("Not allowed by cors");
  },
};

app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb://127.0.0.1:27017" || process.env.MONGO_URI; //mongo uri is hidded provide your own mongo uri
mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (error) => (error ? console.log(error) : "")
);

const connection = mongoose.connection;
connection.once("open", () => console.log("Connected to Mongo Atlas"));

const routes = require("./routes/router");
app.use("/", routes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
