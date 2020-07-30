const express = require('express');
const User = require('../model/User');
const {Post} = require('../model/Post');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomString = require('randomstring');
const mailer = require('../config/mailer');

//compose
router.route('/compose')
.get((req,res)=>{
    if(req.isAuthenticated())
    {   
        res.render('compose',{isLogin:true,user:req.user})
    }
    else{
        req.flash(
            'error_msg',
            'Please Login For Compose'
        );
        res.redirect('/users/login');
    }
})
.post((req,res)=>{
    const {title,content} = req.body;
    let msg='';
    if(!title||!content)
    {
        msg='Please enter all fields';
    }
    else{
        if(content.length < 50)
        {
             msg= 'Content length should be greater the 50 character';
        }
    }
    if(msg!=='')
        {
            res.render('compose',{msg,title,content,isLogin:true,user:req.user});
        } 
    else{
            const newPost = new Post({
                title,
                content,
                UserId:req.user.id,
            })  
            User.findOneAndUpdate(
                { _id: req.user.id }, 
                { $push: { blog: newPost } },
            function (error, success) {
                    if (error) {
                        console.log(error);
                    } 
                })
                newPost.save(err=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {    req.flash(
                            'success_msg',
                            'Post added Succesully'
                        );
                        res.redirect('/users/compose');
                    }
                })
       }

})

//Dashboard 
router.route('/dashboard')
.get((req,res)=>{
    if(req.isAuthenticated()){
        User.findById(req.user._id,(err,user)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                if(user.blog.length!==0)
                {
                    res.render('dashboard',{isLogin:true,posts:user.blog,user:req.user});
                }
                else{
                        res.render('dashboard',{isLogin:true,user:req.user})
                }
            }
        })
    }
    else{
        req.flash(
            'error_msg',
            'Please Login First'
        );
        res.redirect('/users/login');
    }
})
//Login
router.route('/login')
.get((req,res)=>{
   res.render('Login',{isLogin:false});
})
.post((req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
})
//logout
router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})
//register
router.route('/register')
    .get((req,res)=>{
        res.render('signup',{isLogin:false});
    })
    .post((req,res)=>{
        const {name,email,password,password2} = req.body;
        let msg ='';
        if(!name||!email||!password||!password2)
        {
            msg='Please enter all fields';
        }
        else{
            if(password.length<6)  {msg='Password must be at least 6 character';}
            else{
                if(password!==password2)
                {
                    msg='Password do not match';
                }
            }
        }
        if(msg!=='')
        {
            res.render('signup',{msg,name,email,password,password2});
        }
        else{
            User.findOne({email:email},(err,user)=>{
                if(err) console.log(err);
                else{
                    if(user)
                    {
                        msg='Email already registered';
                        res.render('signup',{msg,name,email});
                    }
                    else{
                        const hashPassword = bcrypt.hashSync(password, 10);
                        const secretToken = randomString.generate();
                        const active = false;
                        const newUser = new User({
                            name,email,password:hashPassword,secretToken,active
                        })
                        newUser.save(err=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {   
                                const html = `<h1>Thanks for signup in Daily Journal</h1><br><h2>Click here to <a href="https://aqueous-gorge-92975.herokuapp.com/verify/${secretToken}">verify email</a></h2>`;
                                mailer('jatinkumarjk2001@gmail.com',email,'Please Verify Your Email',html);
                                 req.flash(
                                    'success_msg',
                                    'Verification mail sent'
                                );
                                res.redirect('/users/login');
                            }
                        })
                        
                    }
                }
            })
        }
    })

module.exports = router;   