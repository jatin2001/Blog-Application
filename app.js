require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport= require('passport');
const app = express();
const {postSchema} = require('./model/Post')
app.use(express.static('public'));
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//config passport 
require('./config/passportconfig')(passport);


//connecting mongodb
mongoose.connect(
    `mongodb+srv://admin-jatin:${process.env.Cluster_Password}@cluster0.ktbyq.mongodb.net/dailyJournalDB`,
    { useNewUrlParser: true ,useUnifiedTopology: true}
    ,(err)=>{
    err?console.log(err):console.log('Database Connected');
    }
)

//ejs
app.set('view engine','ejs')

//bodyParser
app.use(express.urlencoded({extended:true}))

//express-session
app.use(
    session({
      secret: process.env.Session_Secret,
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });



//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/user'));
app.use('/posts',require('./routes/postRoute'));
app.use('/verify',require('./routes/verify'));

const PORT = process.env.PORT||4000;
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})