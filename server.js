const express = require("express")
const cors = require("cors")

const dbConfig = require("./src/config/db.config");

const app = express();

var corsOptions={
    origin:"http://localhost:8081"
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended:true}))

const db = require("./src/models");
const Books = db.Books

db.mongoose.
connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("Sucessfully connected to Mongo db")
})
.catch(err =>{
    console.error("connection error",err);
    process.exit()
})

require("./src/routes/book.routes")(app)
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

//global error handler
app.use((error,request,response,next)=>{
    console.error(error.stack);
    response.status(error.status || 500).json({error:'Internal server error'})
})