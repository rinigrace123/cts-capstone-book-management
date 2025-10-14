const fs = require("fs");
const path = require("path");
const Book = require("../models/book.model");

const baseUrl = "http://localhost:3000/files/";

const uploadFiles = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send({ message: "Please upload a file" });
    }

    const bookId = request.params.bookId;
    const book = await Book.findById(bookId);

    if (!book) {
      return response.status(404).send({ message: `Book with ID ${bookId} is not found` });
    }

    if (book.author !== request.userId) {
      return response.status(403).send({ message: 'You are not authorized to upload book images' });
    }

    // Check if file is JPEG
    if (request.file.mimetype === 'image/jpeg' || request.file.mimetype === 'image/jpg') {
      const originalPath = request.file.path;
      const newFilename = `${path.basename(originalPath, path.extname(originalPath))}.jpg`;
      const newPath = path.join(path.dirname(originalPath), newFilename);

      // Rename the file to .jpg
      fs.renameSync(originalPath, newPath);
    }

    return response.status(200).send({ message: "Book image uploaded successfully" });
  } catch (error) {
    return response.status(500).send({ message: error.message || "Error in uploading file" });
  }
};



const getFiles = async (request, response) => {
  try {
    const directoryPath = path.join(__basedir, "/uploads/");
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return response.status(500).send({ message: err.message });
      }

      let fileDetails = [];
      files.forEach(file => {
        fileDetails.push({
          name: file,
          base_url: baseUrl + file
        });
      });

      return response.status(200).send(fileDetails);
    });
  } catch (error) {
    return response.status(500).send({ message: error.message || "Error in fetching files" });
  }
};

const downloadFiles = async (request, response) => {
  try {
    const fileName = request.params.fileName;
    const bookId = request.params.bookId;

    if (!fileName || !bookId) {
      return response.status(400).send({ message: "Missing file name or book ID" });
    }

    const filePath = path.join(__basedir, "uploads", bookId, fileName);

    response.download(filePath, fileName, (error) => {
      if (error) {
        return response.status(500).send({ message: "Cannot download the file. " + error.message });
      }
      // No need to send another response here — download already handles it
    });
  } catch (error) {
    return response.status(500).send({ message: error.message || "Error in downloading file" });
  }
};


const deleteFiles = async (request, response) => {
  try {
    const fileName = request.params.fileName;
    const bookId = request.params.bookId;

    const book = await Book.findById(bookId);
    if (!book) {
      return response.status(404).send({ message: "Book not found" });
    }

    if (book.author !== request.userId) {
      return response.status(403).send({ message: "You are not the author of this book, so you cannot delete the files" });
    }

    const directoryPath = path.join(__basedir, "uploads", bookId);
    const filePath = path.join(directoryPath, fileName);

    // Delete the file
    await fs.unlink(filePath);

    // Check remaining files
    const files = await fs.readdir(directoryPath);

    if (files.length === 0) {
      // Delete the folder if empty
      await fs.rmdir(directoryPath);
      return response.status(200).send({ message: "Folder and file deleted successfully" });
    } else {
      return response.status(200).send({ message: "Book image deleted successfully" });
    }
  } catch (error) {
    return response.status(500).send({ message: error.message || "Error in deleting file" });
  }
};


module.exports = {
  uploadFiles,
  getFiles,
  downloadFiles,
  deleteFiles
};
