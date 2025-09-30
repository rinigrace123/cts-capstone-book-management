const controller = require("../controllers/book.controller");
const { title, author, date, genre, description, rating, comments } = require('../utils/validator')
const { verifyToken, isAdmin } = require("../middlewares/authJwt");
const pathUrl = "/api/books"

const validate = validations => {
    return async (request, response, next) => {
        for (const validation of validations) {
            const result = await validation.run(request);
            if (!result.isEmpty()) {
                return response.status(400).json({ error: result })
            }
        }
        next();
    };
};
module.exports = function (app) {

    app.post(pathUrl, verifyToken,
        validate([title, author, date, genre, description]),
        controller.addBook);

    app.get(pathUrl, verifyToken, controller.getBooks)

    app.get(`${pathUrl}/:id`, controller.getBookById)

    app.delete(`${pathUrl}/:id`, isAdmin, controller.deleteBook)

    app.put(`${pathUrl}/:id`, verifyToken, isAdmin, controller.editBookById)


    app.post(`${pathUrl}/:id/reviews`,
        validate([rating, comments]),
        controller.addReviews)

    app.get(`${pathUrl}/:id/reviews`,
        controller.getReviews)

    app.delete(`${pathUrl}/reviews/:id`, verifyToken, controller.deleteReview)

    app.put(`${pathUrl}/reviews/:id`, verifyToken, validate([rating, comments]), controller.editReview);
}
