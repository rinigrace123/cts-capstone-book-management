const db = require("../models")
const Book = db.Book
//Save books
exports.addBook = (request, response) => {
  if (!request.body.title.trim()) {
    response.status(400).send({ message: "Title can not be empty" });
    return;
  }
  const book = new Book({
    title: request.body.title.trim(),
    author: request.body.author.trim(),
    genre: request.body.genre.trim(),
    year: request.body.year.trim(),
    description: request.body.description.trim()
  })
  book
    .save(book)
    .then(data => {
      response.send(data);
    })
    .catch(error => {
      response.status(500).send({
        message:
          error.message || "Some error occurred while adding the books."
      });
    });
};

//Get all the books
exports.getBooks = (request, response) => {
  const title = request.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Book.find(condition)
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