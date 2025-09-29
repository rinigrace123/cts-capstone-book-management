const db = require("../models");
const Book = db.Book;
const Reviews = db.Review;

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
exports.getBooks = async (_, response) => {
  try {
    const data = await Book.find({})
    response.send(data);
  } catch (err) {
    response.status(500).send({
      message:
        err.message || "Some error occurred while retrieving books."
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

//Add reviews for book
exports.addReviews = async (request, response) => {
  const reviewData = request.body;
  try {
    const review = new Reviews({
      bookId: request.params.id,
      rating: reviewData.rating,
      comment: reviewData.comments,
    });

    const saveReview = await review.save();
    response.send(saveReview);
  } catch (error) {
    response.status(500).send({
      message: error.message || "Some error occurred while adding the review."
    });
  }
};

//Get Reviews for book
exports.getReviews = async (request, response) => {
  const bookId = request.params.id;

  try {
    const reviewsData = await Reviews.find({ bookId: bookId });

    if (reviewsData.length === 0) {
      return response.status(404).json({ message: 'No reviews found for this book.' });
    }

    response.status(200).json(reviewsData);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    response.status(500).json({ message: 'Server error while retrieving reviews.' });
  }
};

//Delete Review for book
exports.deleteReview = async (request, response) => {
  const reviewId = request.params.id;
  console.log(reviewId)

  try {
    const deletedReview = await Reviews.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return response.status(404).json({ message: 'Review not found.' });
    }

    response.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    response.status(500).json({ message: 'Server error while deleting review.' });
  }
};

// Edit Review for book
exports.editReview = async (request, response) => {
  const reviewId = request.params.id;
  const updatedData = request.body;

  try {
    const updatedReview = await Reviews.findByIdAndUpdate(
      reviewId,
      {
        rating: updatedData.rating,
        comment: updatedData.comments,
      },
    );

    if (!updatedReview) {
      return response.status(404).json({ message: 'Review not found.' });
    }

    response.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    response.status(500).json({ message: 'Server error while updating review.' });
  }
};


