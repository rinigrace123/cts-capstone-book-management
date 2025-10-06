const controller = require("../controllers/review.controller");
const { rating, comments } = require('../utils/validator')
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


    app.post(`${pathUrl}/:id/reviews`,verifyToken,
        validate([rating, comments]),
        controller.addReviews)

    app.get(`${pathUrl}/:id/reviews`,verifyToken,
        controller.getReviews)

    app.delete(`${pathUrl}/reviews/:id`, verifyToken, controller.deleteReview)

    app.put(`${pathUrl}/reviews/:id`, verifyToken, validate([rating, comments]), controller.editReview);
}
