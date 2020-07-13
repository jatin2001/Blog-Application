const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const { kebabCase } = require('lodash');
const app = express();
mongoose.connect('mongodb+srv://admin-jatin:9873804639@cluster0.ktbyq.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});

let isLogin =false;
let userId = '';
const postSchema = new mongoose.Schema({
    title:String,
    content:String,
    User:String,
})

const Post = mongoose.model("Post",postSchema);
const item1 = new Post({
    title:'item 1',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
})

const item2 = new Post({
    title:'item 2',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
})

const defaultItem = [item1,item2];


const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    emailID:String,
    password:String,
    blog:[postSchema],
})

const User = mongoose.model('User',userSchema);

const aboutContent = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.";
const contactContent ="At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus";
let isAdmin = false;
app.use(express.static('public'));
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));

const loginArray =[{email:'jatinkumarjk2001@gmail.com',password:'9873804639'}];

app.get('/',(req,res)=>{
    Post.find((err,items)=>{
        if(err)
        {
            console.log(err);
        }
        else{
           if(items.length == 0)
           {
               Post.insertMany(defaultItem,(err)=>{
                   err?console.log(err):'';
               })
               res.redirect('/');
           }
           else{
                res.render('home',{posts:items,isLogin});
           }
        }
    })
})
app.get('/about',(req,res)=>{
    res.render('about',{aboutContent,isLogin});
})

app.get('/contact',(req,res)=>{
    res.render('contact',{contactContent,isLogin});
})

app.get('/compose',(req,res)=>{
    if(isLogin)
    {
        res.render('compose',{isLogin});
    }
    else{
        res.redirect('/userlogin');
    }
})

app.post('/compose',(req,res)=>{
     
        const newpost = new Post({
            title:req.body.title,
            content:req.body.post,
            User:userId,
        })  
        User.findOneAndUpdate(
            { _id: userId }, 
            { $push: { blog: newpost } },
           function (error, success) {
                 if (error) {
                     console.log(error);
                 } 
             })
        newpost.save();
    
    res.redirect('/');
})


app.get('/posts/:post',(req,res)=>{
    const title = _.lowerCase(req.params.post);
    Post.find((err,posts)=>{
        if(!err)
        {
            posts.forEach(post=>{
                if(post.title===title)
                {   if(post.User===undefined)
                    {
                        res.render('post',{post,isLogin,name:"App Brewery"})
                    }
                    else{
                        User.findOne({ _id: post.User }, function (err, user) {
                            const firstname = user.firstName;
                            const lastname = user.lastName;
                            const name = firstname +' ' + lastname;
                            res.render('post',{post,isLogin,name})
                        });
                    }
                   
                }
            })
        }
    })
})

app.get('/adminlogin',(req,res)=>{
    res.render('Login',{formName:'admin'})
})

app.post('/adminlogin',(req,res)=>{
    let {email,password} = req.body;
    loginArray.forEach(item=>{
        if(email===item.email && password === item.password)
        {   
            res.redirect('/compose');
        }
    })
})

app.get('/userlogin',(req,res)=>{
    res.render('Login',{formName:'user'});
})
app.post('/userlogin',(req,res)=>{
    const {email,password} = req.body;
   User.find((err,users)=>{
       if(!err)
       {
          users.forEach(person=>{
              if(person.emailID===email||person.password==-password)
              {   isLogin=true;
                  userId=person._id;
                  res.redirect('/compose');
              }
          })
       }
   })
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})
app.post('/signup',(req,res)=>{

    const {firstName,lastName,Email,password} = req.body;
    const newUser = new User(
        {
            firstName,
            lastName,
            emailID:Email,
            password,
        }
    )
    newUser.save();

    res.redirect('/userlogin');
    
})

app.get('/logout',(req,res)=>{
    isLogin=false;
    userId='';
    res.redirect('/');
})

app.get('/dashboard',(req,res)=>{
   if(userId==='')
   {
    res.redirect('/userlogin');
   }
  else{
      User.findById(userId,(err,user)=>{
          if(!err)
          {
              res.render('dashboard',{posts:user.blog});
          }
      })
  }
})

app.post('/delete',(req,res)=>{
    const Id = req.body.id;
    User.findByIdAndUpdate(
        userId, { $pull: { "blog": { _id: Id } } },
        function(err) {
            if (err) { console.log(err); }
        });
    Post.findByIdAndRemove(Id,(err)=>{
        err?console.log(err):'';
    })
    res.redirect('/dashboard');
})


app.listen(process.env.PORT || 5000)