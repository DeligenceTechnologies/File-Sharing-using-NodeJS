const mongoose=require('mongoose');
const schema= mongoose.Schema


const fileSchema=new schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    
 
},{timestamps:true}
)

module.exports=mongoose.model('user-authentication',fileSchema);