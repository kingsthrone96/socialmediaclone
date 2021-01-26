module.exports = {
  signUpName: {
    type: "string",
    isAbsolute: true,
    min: 3,
    required: true,
  },

  signUpEmail: {
    type: "string",
    min: 10,
    required: true,
  },

  signUpPassword: {
    type: "string",
    min: 6,
    required: true,
  },
};
