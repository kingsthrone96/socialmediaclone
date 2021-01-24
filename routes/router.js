const express = require('express');

const route = express.Router();

const verifyToken = require('./verifyToken');
const { createUser, loginUser } = require('./userAuth');
const { homepage, logout } = require('./requestAPI');


route.post('/createUser', createUser);
route.post('/loginUser', loginUser);
route.get('/logout', logout);

route.get('/homepage', verifyToken, homepage);


module.exports = route;