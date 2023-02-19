const multer=require('multer');
const express=require('express')
//var router = require('express').Router();
const router = express.Router();
const path=require('path');
const passport=require('passport')
var file=require('./model/files')
const {v4:uuid4}=require('uuid');
require('dotenv').config()
const storage= multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'./uploads'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${(Math.random*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
   
})
//multet in
let uploads=multer({
  storage,
  limit:{fileSize:100000*1000}
}).single('file')






//upload files
router.post('/',(req,res)=>{
//store file


  uploads(req,res,async(err)=>{
    
    const fileName = name + path.extname(req.file.originalname)
 await app.locals.bucket.file(fileName).createWriteStream().end(req.file.buffer)


    //validate request


 if(!req.file){
    return res.json({error:"error all fields are required"})
      }
   if(err){
   return res.status(500).send("Internal error");
    }
  
  
  
  //store into database

  file=new file({
    filename:req.file.filename,
    uuid:uuid4(),
    path:req.file.path,
    size:req.file.size
 })
 
 const  response= await file.save()
 return res.json({files: ` ${process.env.APP_Base_Url}/files/${file.uuid}`})

  })
})

//send download link to the email
router.post('/send', async(req,res)=>{
  console.log(req.body)
  const {uuid,emailTo,emailfrom}=req.body;
  if(!uuid || !emailTo ||!emailfrom ){
    return res.status(422).send('all field are required')
  };
  //get data from database
   const File =await file.findOne({uuid:uuid})
    
  if(File.sender){
    return res.status(422).send('email already send')

  }
  File.sender=emailfrom;
  File.reciver=emailTo;
  
  const response=await File.save();

  //send email

  const sendMail=require('./emailservices');
  sendMail({
    from:emailfrom,
    to:emailTo,
    subject:"file sharing",
    text:`${emailfrom} shared a file with you`,
    html:require('./emailTemplate')({
       emailfrom:emailfrom,
       downloadLink:`${process.env.APP_Base_Url}/files/${File.uuid}`,
       size:parseInt(File.size/1000)+'kb',
       expires:'24 hours'
    })
  });
return res.send({success:"true"})
});

//fetch all files
router.get('/',async (req,res)=>{
 const files= await  file.find();
return res.send(files);
})

//delete request 
router.delete('/',async (req,res)=>{
const deletefiles= await file.deleteMany();
res.send(`successfully deleted`)
})

//delete one file data
router.delete('/:_id',async(req,res)=>{
  const deleteone= await file.deleteOne({_id:req.params._id})
  res.send(deleteone)
})
module.exports=router