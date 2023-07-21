//jshint esversion:8
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption'); --
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRound = 10;

const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));


mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){

  bcrypt.hash(req.body.password, saltRound)
          .then(function(hash){
            const newUser = new User({
               email: req.body.username,
               password: hash
             });

             newUser.save()
                     .then(function(){
                       res.render('secrets');
                     })
                     .catch(function(err){
                       console.log(err);
                     });
          })
          .catch(function(err){
            console.log(err);
          });


});

app.post('/login', function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email: userName})
        .then(function(foundUser){
          bcrypt.compare(password, foundUser.password)
                  .then(function(result){
                    if(result == true)
                      res.render('secrets');
                  })
                  .catch(function(err){
                    console.log(err);
                  });
        });
});

app.listen(3000, function(){
  console.log('Server is up and listening on port 3000');
});
