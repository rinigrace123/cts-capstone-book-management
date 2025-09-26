const { body } = require('express-validator');
const moment = require('moment');
const {Book} = require("../models")

const genreArray = ['Action', 'Drama', 'Thriller','Horror','Education'];

const checkDuplicateTitles = async(title)=>{
  const existingTitle = await Book.findOne({
      title: { $regex: new RegExp(title, 'i') }
    });
    if (existingTitle) {
        throw new Error('Title already exists.');
    }
    return true;
}
exports.title = body('title')
  .notEmpty()
  .withMessage('Title cannot be empty')
  .bail().custom(checkDuplicateTitles)

exports.author = body('author').notEmpty().withMessage('Author is required')

exports.description = body('description').notEmpty().withMessage('Description can not be empty').isLength({ max: 100 }).withMessage('Description cannot exceed 100 characters')

exports.date =  body('date').notEmpty().withMessage('Date cannot be empty').custom((value) => {
      const inputDate = moment(value, 'YYYY-MM-DD', true);
      const today = moment().startOf('day');

      if (!inputDate.isValid()) {
        throw new Error('Invalid date format. Use YYYY-MM-DD');
      }

      if (inputDate.isAfter(today)) {
        throw new Error('Date cannot be in the future');
      }

      return true;
    })

exports.genre = body('genre').notEmpty().withMessage('Genre cannot be empty').isIn(genreArray).withMessage('Genere is not present in the list')

