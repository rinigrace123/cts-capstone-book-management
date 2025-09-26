const db = require("../models");
const Book = db.Book;

exports.addBook = async (request, response) => {
  const bookData = request.body;

  try {
    const book = new Book({
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      genre: bookData.genre.trim(),
      date: bookData.date.trim(),
      description: bookData.description.trim()
    });

    const savedBook = await book.save();
    response.send(savedBook);
  } catch (error) {
    response.status(500).send({
      message: error.message || "Some error occurred while adding the book."
    });
  }
};


//Get all the books
exports.getBooks = (_, response) => {
  Book.find({})
    .then(data => {
      response.send(data);
    })
    .catch(err => {
      response.status(500).send({
        message:
          err.message || "Some error occurred while retrieving books."
      });
    });
};
