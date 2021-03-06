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
  const user = req.currentUser;
  try {
    const newProfile = {
      currentProfilePicture: user.profile.currentProfilePicture,
      currentBackgroundPicture: user.profile.currentBackgroundPicture,
      photos: {
        profilePictures: [...user.profile.photos.profilePictures],
        backgroundPictures: [...user.profile.photos.backgroundPictures],
        postPictures: [...user.profile.photos.postPictures, post.photo],
        allPhotos: [...user.profile.photos.allPhotos, post.photo],
      },
    };
    const updatedUser = await User.findByIdAndUpdate(
      req.currentUser._id,
      {
        $set: {
          profile: newProfile,
        },

        $push: {
          posts: {
            ref: {
              ref_id: req.currentUser._id,
              ref_name: req.currentUser.name,
              ref_pic: req.currentUser.profile.currentProfilePicture
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
    console.log(error);
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
    res.status(400).send(error);
  }
};

const changeProfilePictures = async (req = request, res = response) => {
  const { image } = req.body;
  try {
    const newImage = await User.findByIdAndUpdate(
      req.currentUser._id,
      {
        $set: {
          profile: {
            ...req.currentUser.profile,
            [image.imageFor]: image.imagePath,
          },
        },
      },
      { new: true }
    );

    res.status(201).json({
      imageFor: image.imageFor,
      imagePath: newImage.profile[image.imageFor],
    });
  } catch (error) {
    console.log(error)
    res.status(400).json(error.message);
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
  changeProfilePictures,
};
