const express=require('express');
const path=require('path')
const app=express();
const passport=require("passport")
require("./pasportconfig")
const db=require('./connection');
require('dotenv').config();
const opt = require('./pasportconfig');
 db();

const PORT=4000;

//Passport initialize;
app.use(passport.initialize());
 app.use(passport.session());
 app.use(express.urlencoded({extended:true}))
//set express.json
app.use(express.json());
//template-engine
//app.use(bodyParser.urlencoded({extended:false}));
  // app.use(bodyParser.json());
app.set('view engine', 'ejs')
app.set('views','./views')
app.use('/signup',require('./signup'))
app.use('/login',require('./login'))
app.use('/upload/files',passport.authenticate('jwt',{session:false}),require('./files'))
app.use('/files',passport.authenticate('jwt',{session:false}),require('./show'))
app.use('/files/download'/*passport.authenticate('jwt',{session:false})*/,require('./download'))
app.use('/fetch/files',passport.authenticate('jwt',{session:false}),require('./files'))
app.use('/files/deleteone',passport.authenticate('jwt',{session:false}),require('./files'));
app.get('/',(req,res)=>{
  res.json({message:"request successfully"})
})
app.listen(PORT,()=>{
  console.log("app listen successfully")
}
)
