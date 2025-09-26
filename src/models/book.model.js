const mongoose = require("mongoose");

const Book = mongoose.model(
    "Book",
    new mongoose.Schema({
        title:String,
        author:String,
        genre:String,
        date:Date,
        description:String,
    })
);

module.exports = Book;