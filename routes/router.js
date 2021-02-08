const express = require("express");

const route = express.Router();

const verifyToken = require("./verifyToken");
const { createUser, loginUser } = require("./userAuth");
const {
  homepage,
  logout,
  post,
  getPosts,
  changeProfilePictures,
} = require("./requestAPI");

route.post("/createUser", createUser);
route.post("/loginUser", loginUser);
route.post("/postSomething", verifyToken, post);
route.get("/getAllUsersPosts", getPosts);
route.post("/changeProfilePictures", verifyToken, changeProfilePictures);
route.get("/logout", logout);

route.get("/homepage", verifyToken, homepage);

module.exports = route;
