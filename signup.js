const router = require('express').Router();
const users = require('./model/users')
const bcrypt = require('bcryptjs');
const legit = require('legit');
const jwt = require('jsonwebtoken');
router.post('/', async (req, res) => {
  async function signup() {
    
    const user = new users({
      username: req.body.username,
      email: req.body.email,
      password:req.body.password,
    })
    
    const username =await users.findOne({username:req.body.username})
    if(username){
      res.send("the username is already exist,please try another!")
    }

    await legit(req.body.email)
      .then(async result => {

        if (result.isValid) {
          const User = await users.findOne({ email: req.body.email })


          //check the user already exist in database or not

          if (User) {
            return res.status(400).send("user already exist");
          }

        } else {
          res.send("inValid email")
        }

      })
      .catch(err => console.log(err))


    if (req.body.password) {
    
      result = await user.save();
      payload = {
        username: user.username,
        _id: user._id,
        email: user.email,
      }
      const token = jwt.sign(payload, "rANDOMSTRIGN", { expiresIn: "300000000000000000000" })
      return res.status(200).send({
        success: true,
        message: "register successfully",
        token: "Bearer " + token,
      }),
        res.send(token)

    }
    else{
      res.send(error)
    }

    //save user in database
    module.exports = router














  }
  signup();
})

module.exports = router;