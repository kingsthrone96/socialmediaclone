const express = require("express");
const User = require("../models/User");
const { request, response } = express();

const homepage = async (req = request, res = response) => {
  try {
    res.status(200).json({ currentUser: req.currentUser });
  } catch (error) {
    res.status(500).json({ serverError: error.message });
  }
};

const post = async (req = request, res = response) => {
  const { post } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.currentUser._id,
      {
        $push: {
          posts: {
            ref: {
              ref_id: req.currentUser._id,
              ref_name: req.currentUser.name,
            },
            ...post,
          },
        },
      },
      {
        new: true,
      }
    );
    const userPosts = updatedUser.posts;
    const newPost = userPosts[userPosts.length - 1];
    res.status(201).json({ message: "post successfully added", newPost });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getPosts = async (req = request, res = response) => {
  let usersPosts = [];
  try {
    const users = await User.find({});
    if (users) {
      users.forEach((userPosts) => {
        usersPosts.push(...userPosts.posts);
      });
      const sortedPosts = usersPosts.sort((a, b) => b.date - a.date);
      res.send(sortedPosts);
    } else res.send(usersPosts);
  } catch (error) {
    res.send(error);
  }
};

const logout = (req = request, res = response) => {
  res.status(200).json({ message: "User Logged Out" });
};

module.exports = {
  homepage,
  logout,
  post,
  getPosts,
};
