const express = require('express');
const router = express.Router();
const passport = require('passport');
const {Post} = require('../model/Post');

router.get('/',(req,res)=>{
  Post.find({},(err,posts)=>{     
            err?
            console.log(err)
            :req.isAuthenticated()?res.render('home',{isLogin:true,posts,name:req.user.name,}):res.render('home',{posts,isLogin:false});
  })
})
router.get('/about',(req,res)=>{
  req.isAuthenticated()?res.render('about',{isLogin:true,name:req.user.name}):res.render('about',{isLogin:false});
})
router.get('/contact',(req,res)=>{
  req.isAuthenticated()?res.render('contact',{isLogin:true,name:req.user.name}):res.render('contact',{isLogin:false});
})
// router.get('/dashboard', (req, res) =>{
//   if(req.isAuthenticated())
//   { 
//     res.redirect('/');
//   }
//   else{
//     req.flash('error_msg','Please Login')
//     res.redirect('users/login');
//   }
// }
// );
//goggle login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/auth/google/dashboard', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
        res.redirect('/');
  });


  router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/dashboard',
  passport.authenticate('facebook', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    isLogin=true;
    res.redirect('/');
  });

module.exports = router;  