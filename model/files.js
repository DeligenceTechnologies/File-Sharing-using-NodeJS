const  mongoose = require("mongoose")
const bcrypt=require('bcryptjs');
const schema= mongoose.Schema
const fileSchema=new schema({
  username:{
    type:String,
<<<<<<< HEAD
   
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

=======
    default:null
  },
  email:{
    type:String,
    unique:true,
    default:null
},
password:{
    type:String,
    default:null
},
confirmPassword:{
    type:String,
    default:null
},
  filename:{
   type:String,
   default:null
    },
    path:{type:String,default:null},
    size:{type:Number,default:null},
    uuid:{type:String,default:null},
    sender:{type:String,default:null},
    reciever:{type:String,default:null}
},{timestamps:true}
)
fileSchema.pre("save", async function(next){
  // const passwordHash= await bcrypt.hash(req.body.password,10);
   if(this.isModified("password")){
  this.password= await  bcrypt.hash(this.password,10)
  this.confirmPassword=await bcrypt.hash(this.confirmPassword,10)
  
  // const passwordCompare=await bcrypt.compare(req.body.password,req.body.confirmPassword);

>>>>>>> parent of c78ac36 (email validation)
}
  next();
  
})
module.exports=mongoose.model('file',fileSchema);