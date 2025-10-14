const db = require("../models");
const Book = db.Book;
const Reviews = db.Review;
const redisClient = require("../utils/redis"); 

exports.getBooks = async (request, response) => {
   try {
    const cachedBooks = await redisClient.get("books");

    if (cachedBooks) {
      return response.status(200).json(JSON.parse(cachedBooks));
    }

    const books = await Book.find();

    await redisClient.set("books", JSON.stringify(books), {
      EX: 3600, // expire in 1 hour
    });

    response.status(200).json(books);
  } catch (error) {
    console.error("Error in getBooks:", error);
    response.status(500).json({ message: error.message });
  }
};