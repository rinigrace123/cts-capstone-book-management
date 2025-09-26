const db = require("../models");
const Book = db.Book;
const Reviews =db.Review;

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
exports.deleteBook = (request,response)=>{
  const id = request.params.id;
  Book.findByIdAndDelete(id)
  .then(data =>{
    if(!data){
      response.status(404).send({
        message: `Cannot delete book`
      });
    }else{
      response.send({
        message:'Tutorial was deleted'
      });
    }
  })
  .catch(error =>{
    response.status(500).send({
      message: "Cannot delete book"
    })
  });
};

//Add reviews for book
exports.addReviews = async(request,response)=>{
   const reviewData = request.body;
    console.log(request.params)
  try {
    const review = new Reviews({
     bookId:request.params.id,
     rating:reviewData.rating,
     comment: reviewData.comment,
    });

    const saveReview = await review.save();
    response.send(saveReview);
  } catch (error) {
    response.status(500).send({
      message: error.message || "Some error occurred while adding the review."
    });
  }
};


