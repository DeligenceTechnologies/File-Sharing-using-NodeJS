const router = require('express').Router();
const users = require('./model/users')
const bcrypt = require('bcryptjs');
const legit = require('legit');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer')


//validation error using joi module
const joi = require('joi')

const signupSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
})


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_host,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

router.post('/', async (req, res) => {
  async function signup() {
   // const { emailFrom } = req.body;

    const { error, value } = signupSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(402).json(error.details)
    }

    const user = await users.findOne({ $or:[{username: req.body.username},{email: req.body.email}]})
    if (user) {
      return res.status(403).send("the usernamee or either email is already exist")
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
            const mailOptions = {

              from:"emailverification@darty.fr.cr",
              to: req.body.email,
             subject:"verification email",
             text:"http://localhost:4000/verification/"+token
            };
      
            await transporter.sendMail(mailOptions);
            res.status(201).json({
              message: "the verification email was successfully sent",
              success: true,
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