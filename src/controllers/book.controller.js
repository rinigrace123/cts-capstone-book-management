const db = require("../models");
const bookService = require("../service/book.service");
const Book = db.Book;
const Reviews = db.Review;
const redisClient = require("../utils/redis"); 

exports.addBook = async (request, response) => {
  try {
    if (!request || !request.body) {
      throw new Error("Invalid arguments");
    }

    const bookData = request.body;

    const book = new Book({
      title: bookData.title,
      author: request.userId,
      genre: bookData.genre,
      date: bookData.date,
      description: bookData.description
    });

    const savedBook = await book.save();
   response.status(200).send({
      message: "Saved book successfully",
      book_id: savedBook.id
    });
  } catch (error) {
    response.status(500).send({
      message: error.message || "Some error occurred while adding the book."
    });
  }
};


exports.getBooksController = async (request, response) => {
  bookService.getBooks(request,response)
};



exports.getBookById = async (request, response) => {
  try {
    const id = request.params.id;

    const data = await Book.findById(id);

    if (!data) {
      return response.status(404).send({ message: "Book not found" });
    }

    response.status(200).send(data);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    response.status(500).send({
      message: error.message || "Some error occurred while retrieving the book."
    });
  }
};

//Delete a book by id
exports.deleteBook = (request, response) => {
  const id = request.params.id;
  Book.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        response.status(404).send({
          message: `Cannot delete book`
        });
      } else {
        response.send({
          message: 'Book was deleted'
        });
      }
    })
    .catch(error => {
      response.status(500).send({
        message: "Cannot delete book"
      })
    });
};

exports.editBookById = async (request, response) => {
  try {
    const bookId = request.params.id;

    if (!bookId) {
      return response.status(400).send({ message: "No book ID provided." });
    }

    const updateFields = {};

    for (const key of Object.keys(request.body)) {
      updateFields[key] = request.body[key];
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return response.status(404).send({ message: "Book not found." });
    }

    response.status(200).send({
      message: "Book updated successfully.",
      data: updatedBook
    });
  } catch (error) {
    console.error("Error updating book:", error);
    response.status(500).send({
      message: error.message || "An error occurred while updating the book."
    });
  }
};
