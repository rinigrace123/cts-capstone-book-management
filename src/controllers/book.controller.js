const db = require("../models");
const Book = db.Book;
const Reviews = db.Review;

exports.addBook = async (request, response) => {
  try {
    if (!request || !request.body) {
      throw new Error("Invalid arguments");
    }

    const bookData = request.body;

    const book = new Book({
      title: bookData.title?.trim(),
      author: bookData.author?.trim(),
      genre: bookData.genre?.trim(),
      date: bookData.date?.trim(),
      description: bookData.description?.trim()
    });

    const savedBook = await book.save();
    response.send(savedBook);
  } catch (error) {
    response.status(500).send({
      message: error.message || "Some error occurred while adding the book."
    });
  }
};

exports.getBooks = async (request, response) => {
  try {
    const books = await Book.find({});

    // Fetch reviews for each book
    const booksWithReviews = await Promise.all(
      books.map(async (book) => {
        const reviews = await Reviews.find({ bookId: book._id });
        return {
          ...book.toObject(),
          reviews
        };
      })
    );

    response.send(booksWithReviews);
  } catch (err) {
    response.status(500).send({
      message: err.message || "Some error occurred while retrieving books."
    });
  }
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
          message: 'Tutorial was deleted'
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
