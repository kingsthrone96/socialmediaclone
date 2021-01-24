const express = require('express');

const { request, response } = express();

const homepage = async(req = request, res = response) => {
    try {
        res.status(200).json({ currentUser: req.currentUser });
    } catch (error) {
        res.status(500).json({ serverError: error.message })
    }
}

const logout = (req = request, res = response) => {
    res.status(200).json({ message: 'User Logged Out'});
}

module.exports = {
    homepage, logout
}