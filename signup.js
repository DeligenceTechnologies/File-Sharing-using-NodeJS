const router = require('express').Router();
const users = require('./model/files')
const bcrypt=require('bcryptjs');
const legit=require('legit');
router.post('/', async (req, res) => {
async  function  signup() {
    const user = new users({
      username:req.body.username,
      email: req.body.email,
      password:req.body.password,
      confirmPassword:req.body.confirmPassword
    })


    await legit (req.body.email)
    .then(async result => {

      if (result.isValid) {
        const User =  await users.findOne({ email: req.body.email })


        //check the user already exist in database or not

        if (User) {
          return res.status(400).send("user already exist");
        }
       
      }
  else {
  res.send("inValid email")
}

})
.catch(err => console.log(err))

  
  if(req.body.password==req.body.confirmPassword){
     result= await  user.save();
    res.send(result)
  
  }
  else{
    res.send("password mismatch")
  }
  
   //save user in database
  
  
 


    
   
  

 




    
  
  }
signup();
})

module.exports = router;