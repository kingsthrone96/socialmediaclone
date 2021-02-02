const express = require("express");

const route = express.Router();

const verifyToken = require("./verifyToken");
const { createUser, loginUser } = require("./userAuth");
const { homepage, logout, post, getPosts } = require("./requestAPI");

route.post("/createUser", createUser);
route.post("/loginUser", loginUser);
route.post("/postSomething", verifyToken, post);
route.get("/getPosts", getPosts);
route.get("/logout", logout);

route.get("/homepage", verifyToken, homepage);

module.exports = route;
