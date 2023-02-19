const  mongoose = require("mongoose");
mongoose.set('strictQuery', true)
require('dotenv').config();
function db(){
    mongoose.connect("mongodb+srv://kaushit:"+encodeURIComponent("7H$y9!E.vX#qg#Q")+"@cluster1.4ve1duv.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});
    const connection=mongoose.connection
    connection.once('open', function () {
        console.log('MongoDB running');
      })
     
    }
module.exports=db;