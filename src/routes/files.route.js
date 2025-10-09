const controller= require("../controllers/file.controller");
const uploadFilesMiddleware = require("../middlewares/fileUpload")
const { verifyToken } = require("../middlewares/authJwt");


module.exports = function (app) {
  app.post("/api/files/upload/:bookId",verifyToken,uploadFilesMiddleware,controller.uploadFiles);

  app.get("/api/files",uploadFilesMiddleware,controller.getFiles);

  app.get("/files/:bookId/:fileName",verifyToken, uploadFilesMiddleware, controller.downloadFiles)

  app.delete("/files/:bookId/:fileName",verifyToken, uploadFilesMiddleware, controller.deleteFiles)
}
