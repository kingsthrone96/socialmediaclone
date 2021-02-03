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
    },

    posts: [
      {
        ref: {
          ref_id: String,
          ref_name: String,
        },
        textContent: String,
        photo: String,
        likes: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        comments: [
          {
            name: String,
            profileId: String,
            comment: String,
          },
        ],
      },
    ],
  }),
  "users"
);
