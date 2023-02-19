const router=require('express').Router();
const file=require('./model/files')
require('dotenv').config();
router.get('/:uuid',async(req,res)=>{
    //console.log(req.params.uuid)

    const  File=await file.findOne({uuid:req.params.uuid});
    if(!File){
        return res.render('download',{msg:'Link has been expired'}); 

    }
    return res.render('download',{
        uuid:file.uuid,
        fileName:file.filename,
        fileSize:file.size,

        download:`${process.env.APP_Base_Url}/files/download/${File.uuid}`
        //http://localhost:3000/files/download/6ad45455j65k6kj6k6k7k7jk6k6
    })
    
})


module.exports=router;