const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db ={};

db.mongoose = mongoose;

db.Book = require("./book.model")

db.Review = require("./review.model")

db.user = require("./user.model")

db.role = require("./role.model")

db.ROLES = ["user", "admin"];

module.exports = db; 