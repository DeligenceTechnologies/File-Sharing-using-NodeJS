const router = require('express').Router();
const users = require('./model/users')
const bcrypt = require('bcryptjs');
const legit = require('legit');
const jwt = require('jsonwebtoken');


//validation error using joi module
const joi = require('joi')

const signupSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required()
})

router.post('/', async (req, res) => {
  async function signup() {
    const { error, value } = signupSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(402).json(error.details)
    }

    const user = await users.findOne({ username: req.body.username, email: req.body.email })
    if (user) {
      return res.status(403).send("the user is already exist,please try another username & email")
    }
    else {

      await legit(req.body.email)
        .then(async result => {

          if (result.isValid) {
            //check the user already exist in database or not
            const user = new users({
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
            })

            result = await user.save();
            payload = {
              username: user.username,
              _id: user._id,
              email: user.email,
            }
            const token = jwt.sign(payload, "rANDOMSTRIGN", { expiresIn: "300000000000000000000" })
            res.status(201).json({
              message: "user successfully registerd",
              success: true,
              user: {
                username: user.username,
                email: user.email,
                password: user.password,
                user_id: user._id,
                token: "Bearer " + token,
              }
            }
            )


          } else {
            return res.send("inValid email")
          }

        })
    }



    //save user in database
    module.exports = router














  }
  signup();
})

module.exports = router;