const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.DB_URL;

const connectDB = mongoose.connect(db);

module.exports = connectDB;