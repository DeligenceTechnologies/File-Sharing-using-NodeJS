const router = require('express').Router();
const users = require('./model/users')
const jwt =require('jsonwebtoken')
const bcrypt =require('bcryptjs')
let payload;
router.post('/', (req,res)=>{
    users.findOne({email:req.body.email}).then(user=>{
         if(!user ){
            return res.status(401).send({
                success:true,
                message:"user does not exist" 
            })
         }
       const passwordCheck=  bcrypt.compareSync(req.body.password,user.password)
         if(!passwordCheck){
            console.log(passwordCheck)
            return res.status(401).send({
                success:false,
                message:"incorrect password" 
         })
        }else{
         payload={
            username:user.username,
            _id:user._id,
            email:user.email
        }
       const token= jwt.sign(payload,"rANDOMSTRIGN",{expiresIn:"300000000000000000"})
       return  res.status(200).send({
        success:true,
        message:"logged in successfully",
        token:"Bearer " + token
       })
    }
    })
})
module.exports=router ;