const controller = require ("../controllers/book.controller");
module.exports = function(app){
    //Post call to save books
    app.post("/api/books",controller.addBook);

    app.get("/api/books",controller.getBooks)
}