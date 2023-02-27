const router = require('express').Router();
const users = require('./model/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
let payload;
//validation occurs
const joi = require('joi')

const loginSchema = joi.object({
   email: joi.string().email().required(),
   password: joi.string().required()
})
router.post('/', async (req, res) => {
   const { error, value } = loginSchema.validate(req.body, { abortEarly: false })
   if (error) {
      res.status(502).send(error.details)


   } else {


      users.findOne({ email: req.body.email }).then(user => {
         if (!user) {
            return res.status(401).send({
               success: true,
               message: "user does not exist"
            })
         }
         const passwordCheck = bcrypt.compareSync(req.body.password, user.password)
         if (!passwordCheck) {
            console.log(passwordCheck)
            return res.status(401).send({
               success: false,
               message: "Invalid email or password"
            })

         } else {
            payload = {
               username: user.username,
               _id: user._id,
               email: user.email
            }
            const token = jwt.sign(payload, "rANDOMSTRIGN", { expiresIn: "300000000000000000" })
            return res.status(200).send({
               success: true,
               message: "logged in successfully",
               token: "Bearer " + token
            })
         }

      })
   }
})
module.exports = router;