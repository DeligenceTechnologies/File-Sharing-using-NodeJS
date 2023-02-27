const router = require('express').Router();
const users = require('./model/users')
const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken')

router.get('/verification/:token', async (req,res)=>{
    const token =req.params.token
    const decode = jwt.decode(token, { complete: true })
    const userid=decode.payload._id
    const User= await users.findOne({_id:userid})
    if(User){
       const user=  await users.updateOne({verified:false},{$set:{verified:true}})
       res.status(200).json({
            message:"user verified successfully",
            success:true,
            user:{
                username:User.username,
                email:User.email,
                password:User.password,
                verified:true
            }

        })
       
    }else{
        return res.status(403).send({
            message:"user verified unsuccessfully",
            success:false,
            err:{
                   message:"user not registerd",
                   verified:false
            }
        })
    }


  
})
module.exports=router