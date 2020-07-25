const express = require('express');
const router = express.Router();
const User = require('../model/User');
const {Post} = require('../model/Post');

router.route('/delete')
.post((req,res)=>{
    
        const Id = req.body.id;
        User.findByIdAndUpdate(req.user._id, { $pull: { "blog": { _id: Id } } },
            function(err) {
                if (err) { console.log(err); }
            });
        Post.findByIdAndRemove(Id,(err)=>{
            err?console.log(err):'';
        })
        req.flash('success_msg', 'Post deleted succesfully');
        res.redirect('/users/dashboard');
})
router.post('/:post',(req,res)=>{
    const title = req.params.post;
    Post.findById(req.body.blogId,(err,post)=>{
            if(err) console.log(err);
            else{
                User.findById(post.UserId,(err,user)=>{
                    if(err) console.log(err);
                    else{
                        req.isAuthenticated()?res.render('post',{post,isLogin:true,name:user.name,email:user.email}):res.render('post',{post,name:user.name,email:user.email,isLogin:false});
                    }
                })
            }
    })
})

module.exports = router;   