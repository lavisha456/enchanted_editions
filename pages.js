// pages.js
const express = require("express");
const path = require("path");
const router = express.Router();

// Route for User Login
router.get('/user-sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/User_Login.html'));
});

// Route for User Sign Up
router.get('/user-sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/User_Signup.html'));
});

// Route for Staff Sign In
router.get('/staff-sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/Staff_login.html'));
});

// Home page (type_of_login.html)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/type_of_login.html')); 
});

module.exports = router;
