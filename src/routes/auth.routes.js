const controller = require("../controllers/auth.controller");
const {verifySignUp} = require("../middlewares");
const { verifyToken,isAdmin } = require("../middlewares/authJwt");
module.exports = function(app) {
  app.use(function(request, response, next) {
    response.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/register",
    [ verifySignUp.checkForUsernameOrEmail],
    controller.signup
  );

  app.post("/api/login", controller.signin);

  app.get("/api/admin/users",verifyToken,isAdmin,controller.getAllUsers)

  app.delete("/api/admin/users/:id",verifyToken,isAdmin,controller.deleteUsers)

  app.put("/api/admin/users/:id",verifyToken,isAdmin,
    [verifySignUp.checkForDuplicateUsernameorEmail],
    controller.editUsers)

};