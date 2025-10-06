const mongoose = require("mongoose")

const Reviews = mongoose.model(
    "Reviews",
    new mongoose.Schema({
        bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
      userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
        rating:Number,
        comment:String,
    })
)

module.exports = Reviews;