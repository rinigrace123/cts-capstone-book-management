const chai = require("chai");
const expect = chai.expect;

const sinon = require("sinon");
const rewire = require("rewire");
const mongoose = require("mongoose");

const sandbox = sinon.createSandbox();
let bookController = rewire("../controllers/book.controller");

const mockRequest = (options) => ({
  params: options.params || {},
  query: options.query || {},
  body: options.body || {},
  headers: options.headers || {},
  ...options,
});

const mockResponse = () => {
  const res = {};
  res.status = sandbox.stub().returns(res);
  res.send = sandbox.stub().returns(res);
  res.json = sandbox.stub().returns(res);
  res.redirect = sandbox.stub();
  return res;
};

describe("Testing /book endpoint", () => {
  let sampleBook;
  let findStub;
  let findOneStub;
  let findOneAndUpdateStub;

  beforeEach(() => {
    sampleBook = {
      title: "Sample Book",
      author: "Sample Author",
      genre: "Education",
      date: "2025-09-26",
      description: "This is sample description"
    };

    findStub = sandbox.stub(mongoose.Model, "find").resolves([sampleBook]);
    findOneStub = sandbox.stub(mongoose.Model, "findOne").resolves(sampleBook);
    findOneAndUpdateStub = sandbox.stub(mongoose.Model, "findOneAndUpdate").resolves(sampleBook);
  });

  afterEach(() => {
    bookController = rewire("../controllers/book.controller");
    sandbox.restore();
  });

describe("Add Book", () => {
  it("should add a book and return saved data", () => {
    const req = mockRequest({
      body: sampleBook
    });

    const res = mockResponse();

    const saveStub = sandbox.stub().resolves(sampleBook);

    const BookMock = function () {
      return { save: saveStub };
    };

    bookController.__set__("Book", BookMock);

    bookController.addBook(req, res)
      .then(() => {
        expect(saveStub).to.have.been.calledOnce;
        expect(res.send).to.have.been.calledWithMatch(sampleBook);
      })
      .catch(() => {
        throw new Error("Unexpected error");
      });
  });
});


  describe("GET all books/", () => {
    it("should get all books", () => {
      const req = mockRequest({});
      const res = mockResponse();

      bookController.getBooks(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(200);
          expect(res.send).to.have.been.calledWith([sampleBook]);
        })
        .catch(() => {
          throw new Error("Failed to test");
        });
    });
  });

  describe("Get Book By id", () => {
    it("should return error when no id is given", () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      bookController.getBookById(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(400);
          expect(res.send).to.have.been.calledWithMatch({ message: sinon.match.string });
        })
        .catch(() => {
          throw new Error("Unexpected error");
        });
    });

    it("should return book with id", () => {
      const req = mockRequest({ params: { id: "someId" } });
      const res = mockResponse();

      bookController.getBookById(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(200);
          expect(res.send).to.have.been.calledWith(sampleBook);
        })
        .catch(() => {
          throw new Error("Unexpected error");
        });
    });
  });


});
