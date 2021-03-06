const express = require("express");
const argon2 = require("argon2");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const { request, response } = express();

const User = require("../models/User");
const Validation = require("../libraries/validation");
const Schema = require("./registerSchema");

const createUser = async (req = request, res = response) => {
  try {
    let errors = [];
    class Validate extends Validation {}
    const schema = Schema;
    const requestBody = req.body;

    const validate = new Validate();
    validate.setSchema(schema);
    validate.compare(requestBody);

    if (validate.errors)
      return res.status(400).json({ clientError: validate.errors });
    const body = validate.validatedBody;
    const checkEmail = await User.findOne({ email: body.signUpEmail });
    if (checkEmail) {
      errors.push({ key: "email", errorMessage: "That email already exist" });
      return res.status(400).json({ clientError: errors });
    } else {
      const hashPassword = await argon2.hash(body.signUpPassword);
      const newUser = await new User({
        name: body.signUpName,
        email: body.signUpEmail,
        password: hashPassword,
      }).save();
      return res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ serverError: error.message });
  }
};

const loginUser = async (req = request, res = response) => {
  try {
    let errors = [];
    const { loginEmail, loginPassword } = req.body;
    if (!loginEmail) {
      errors.push({ key: "email", errorMessage: "Please enter your email" });
      return res.status(400).json({ clientError: errors });
    } else if (!loginPassword) {
      errors.push({
        key: "password",
        errorMessage: "Please enter your password",
      });
      return res.status(400).json({ clientError: errors });
    } else {
      const checkEmail = await User.findOne({ email: loginEmail });
      if (!checkEmail) {
        errors.push({
          key: "email",
          errorMessage: "That email is not registered",
        });
        return res.status(400).json({ clientError: errors });
      } else {
        const currentUser = checkEmail;
        const deHashedPassword = await argon2.verify(
          currentUser.password,
          loginPassword
        );
        if (!deHashedPassword) {
          errors.push({
            key: "password",
            errorMessage: "password do not match",
          });
          return res.status(400).json({ clientError: errors });
        } else {
          const secret = process.env.SECRET;
          const duration = "10h";
          const token = jwt.sign({ ...currentUser }, secret, {
            expiresIn: duration,
          });
          res.status(200).json({ currentUser, token });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ serverError: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
};
