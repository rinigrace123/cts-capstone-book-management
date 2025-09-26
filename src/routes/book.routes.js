const controller = require ("../controllers/book.controller");
const {title,author,date,genre, description,} = require('../utils/validator')
const pathUrl = "/api/books"

const validate = validations =>{
    return async(request,response,next) =>{
        for(const validation of validations){
            const result = await validation.run(request);
            if(!result.isEmpty()){
                return response.status(400).json({error:result})
            }
        }
        next();
    };
};
module.exports = function(app){
    //Post call to save books
    app.post(pathUrl,
        validate([title,author,date,genre,description]),
        controller.addBook);

    app.get(pathUrl,controller.getBooks)
}
