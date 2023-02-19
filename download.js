const express=require('express');
const router=require('express').Router();
const {url}=require("./firebaseStorage")
const file=require('./model/files');
router.get('/uuid',async(req,res)=>{
     const File=await file.findOne({uuid:req.params.uuid})
    if(!File){
        return res.json({message:'error file not found'})
    }
    const filepath=`${File.path}`;
    res.download(url);
    
})

module.exports=router;
  