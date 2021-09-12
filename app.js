//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})


// userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });

const User =  mongoose.model("User",userSchema);
app.get('/',(req,res)=>{
  res.render('home');
})

app.get('/login',(req,res)=>{
  res.render('login');
})

app.get('/register',(req,res)=>{
  res.render('register');
})

app.post('/register',(req,res)=>{

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email : req.body.username,
      password : hash
    })
    newUser.save((err) => {
      if(err){
        console.log(err);
      }else {
        res.render('secrets')
      }
    })
  });


})

app.post('/login',(req,res)=>{
   const mail = req.body.username;
   const password = req.body.password;

  User.findOne({email: mail},(err,foundUser) => {
    if(!err){
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result){
            res.render('secrets')
          }
        });
      }
    }else {
      console.log(err);
    }
  })
})

app.listen('3000',(req,res) => {
  console.log("Server started at port 3000.");
})
