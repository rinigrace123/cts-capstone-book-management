const controller = require("../controllers/book.controller");
const { title, date, genre, description } = require('../utils/validator')
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
        validate([title, date, genre, description]),
        controller.addBook);

    app.get(pathUrl, controller.getBooksController)

    app.get(`${pathUrl}/:id`, controller.getBookById)

    app.delete(`${pathUrl}/:id`,verifyToken, isAdmin, controller.deleteBook)

    app.put(`${pathUrl}/:id`, verifyToken, isAdmin, controller.editBookById)

}
