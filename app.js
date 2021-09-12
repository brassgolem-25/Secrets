//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
const md5 = require('md5');

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
  const newUser = new User({
    email : req.body.username,
    password : md5(req.body.password)
  })
  newUser.save((err) => {
    if(err){
      console.log(err);
    }else {
      res.render('secrets')
    }
  })
})

app.post('/login',(req,res)=>{
  User.findOne({email: req.body.username},(err,foundUser) => {
    if(!err){
      if(foundUser){
        if(foundUser.password === md5(req.body.password)){
          res.render('secrets');
        }
      }
    }else {
      console.log(err);
    }
  })
})

app.listen('3000',(req,res) => {
  console.log("Server started at port 3000.");
})
