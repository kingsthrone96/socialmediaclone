const express = require('express')
const jwt = require("jsonwebtoken");
const User = require('../models/Users');

const {request, response } = express();

require('dotenv').config();

module.exports = (req = request, res = response, next) => {
    try {
        const auth = req.header('authorization');
        if(!auth) return res.status(401).json({ authorizationError: 'Not Authorized!!!'});

        jwt.verify(auth, process.env.SECRET, { }, async (err, decoded) => {
            if(err) return res.status(401).json({ authorizationError: err.message });

            const decodedUser = decoded._doc;
            const currentUser = await User.findOne({ _id: decodedUser._id });
            if(!currentUser) return res.status(404).json({ authorizationError: 'User not found, token not authorized'});

            req.currentUser = currentUser;
            next();
        })
    } catch (error) {
        res.status(200).json({ serverError: error.message });
    }
}