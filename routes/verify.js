const express = require('express');
const router = express.Router();
const User = require('../model/User');
const { isObject } = require('lodash');

router.get('/:post',(req,res)=>{
    const token = req.params.post;
    console.log(token);
    User.findOne({secretToken:token},(err,user)=>{
        if(err) console.log(err);
        else{
            if(!user)
            {
                res.send('<h1>Email already verified</h1>');
            }
            else{
                user.active = true;
                user.secretToken = '';
                user.save(err=>{
                    if(err) console.log(err);
                    else{
                        res.send('<h1>Email verified Successfully</h1>')
                    }
                })
            }
        }
    })
})

module.exports = router; 