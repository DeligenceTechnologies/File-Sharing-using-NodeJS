<<<<<<< HEAD
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema
const fileSchema = new schema({
  userId: {
    type: String,
    required: true
=======
const  mongoose = require("mongoose")
const bcrypt=require('bcryptjs');
const schema= mongoose.Schema
const fileSchema=new schema({
  username:{
    type:String,
   
>>>>>>> 61152fd81162d75b387e7584f7c3b470616bf952
  },
  filename: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true }
)

<<<<<<< HEAD
module.exports = mongoose.model('file', fileSchema);
=======
>>>>>>> parent of c78ac36 (email validation)
}
  next();
  
})
module.exports=mongoose.model('file',fileSchema);
>>>>>>> 61152fd81162d75b387e7584f7c3b470616bf952
