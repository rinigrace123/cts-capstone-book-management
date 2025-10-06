const db = require("../models");
const Reviews = db.Review;

//Add reviews for book
exports.addReviews = async (request, response) => {
  const reviewData = request.body;
  try {
    const review = new Reviews({
      userId:request.userId,
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

  try {
    if (!request.userId) {
      return response.status(401).json({ message: 'User ID missing.' });
    }

    const review = await Reviews.findById(reviewId);
    if (!review) {
      return response.status(404).json({ message: 'Review not found.' });
    }

    if (review.author !== request.userId) {
      return response.status(403).json({ message: 'You can only delete reviews created by you.' });
    }

    await Reviews.findByIdAndDelete(reviewId);
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
  const currentUserId = request.userId; 

  try {
    const review = await Reviews.findById(reviewId);

    if (!review) {
      return response.status(404).json({ message: 'Review not found.' });
    }
    if (review.userId.toString() !== currentUserId) {
      return response.status(403).json({ message: 'You are not authorized to edit this review.' });
    }
    review.rating = updatedData.rating;
    review.comment = updatedData.comments;
    const updatedReview = await review.save();

    response.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    response.status(500).json({ message: 'Server error while updating review.' });
  }
};