const mongoose = require("mongoose");

module.exports = mongoose.connection.useDb("socialNetworking").model(
  "users",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profile: {
      currentProfilePicture: String,
      currentBackgroundPicture: String,
      photos: {
        profilePictures: [],
        backgroundPictures: [],
        postPictures: [],
        allPhotos: [],
      },

      posts: {
        textContent: String,
        photo: String,
        likes: Number,
        comments: [
          {
            name: String,
            profileId: String,
            comment: String,
          },
        ],
      },
    },
  }),
  "users"
);
