const express = require('express');
const authRouter = express.Router();
const jwtAuth = require("../middleware/jwtAuth.js");

const {
    signup, 
    signin,
    logout,
    getUser,
    forgotPassword,
    resetPassword
} = require('../controller/authController.js');



authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/logout', jwtAuth, logout);

authRouter.get('/user', jwtAuth, getUser);
authRouter.post('/forgotPassword',  forgotPassword);
authRouter.post('/resetPassword', resetPassword);

module.exports = authRouter;