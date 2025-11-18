const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // Skip authentication for development
    console.log("Auth middleware - Skipping authentication for development");
    next();
};