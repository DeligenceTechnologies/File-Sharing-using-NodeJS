const router = require('express').Router();
const users = require('./model/files')
const jwt =require('jsonwebtoken')
const bcrypt =require('bcryptjs')
router.post('/', (req,res)=>{
    users.findOne({username:req.body.username}).then(user=>{
         if(!user ){
            return res.status(401).send({
                success:true,
                message:"unauthorized user" 
            })
         }
         const passwordCheck=  bcrypt.compareSync(req.body.password,user.password)
         if(!passwordCheck){
            console.log(passwordCheck)
            return res.status(401).send({
                success:true,
                message:"incorrect password" 
         })
        }else{
        const payload={
            username:user.username,
            uuid:user.uuid,
            email:user.email
        }
       const token= jwt.sign(payload,"rANDOMSTRIGN",{expiresIn:"300000"})
       return  res.status(200).send({
        success:true,
        message:"logged in successfully",
        token:"Bearer " + token
       })
    }
    })
})
module.exports=router