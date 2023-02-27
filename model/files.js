const  mongoose = require("mongoose")
const bcrypt=require('bcryptjs');
const schema= mongoose.Schema
const fileSchema=new schema({
  username:{
    type:String,
   
  },
  email:{
    type:String,

},
password:{
    type:String,
},
},{timestamps:true}
)
fileSchema.pre("save", async function(next){
  // const passwordHash= await bcrypt.hash(req.body.password,10);
   if(this.isModified("password")){
  this.password= await  bcrypt.hash(this.password,10)
  this.confirmPassword=await bcrypt.hash(this.confirmPassword,10)
  
  // const passwordCompare=await bcrypt.compare(req.body.password,req.body.confirmPassword);

}
  next();
  
})
module.exports=mongoose.model('file',fileSchema);