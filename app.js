const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const { kebabCase } = require('lodash');
const app = express();
mongoose.connect('mongodb+srv://admin-jatin:9873804639@cluster0.ktbyq.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});

let isLogin =false;
let userId = '';

const aboutContent = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.";
const contactContent ="At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus";

const postSchema = new mongoose.Schema({
    title:String,
    content:String,
    User:String,
})

const Post = mongoose.model("Post",postSchema);
const item1 = new Post({
    title:'cricket',
    content:'Cricket is a bat-and-ball game played between two teams of eleven players on a field at the centre of which is a 20-metre (22-yard) pitch with a wicket at each end, each comprising two bails balanced on three stumps. The batting side scores runs by striking the ball bowled at the wicket with the bat, while the bowling and fielding side tries to prevent this and dismiss each batter (so they are "out"). Means of dismissal include being bowled, when the ball hits the stumps and dislodges the bails, and by the fielding side catching the ball after it is hit by the bat, but before it hits the ground. When ten batters have been dismissed, the innings ends and the teams swap roles. The game is adjudicated by two umpires, aided by a third umpire and match referee in international matches. They communicate with two off-field scorers who record the matchs statistical information There are quite a few formats ranging from Twenty20, played over a few hours with each team batting for a single innings of 20 overs, to Test matches, played over five days with unlimited overs and the teams each batting for two innings of unlimited length. Traditionally cricketers play in all-white kit, but in limited overs cricket they wear club or team colours. In addition to the basic kit, some players wear protective gear to prevent injury caused by the ball, which is a hard, solid spheroid made of compressed leather with a slightly raised sewn seam enclosing a cork core layered with tightly wound string.',
})

const item2 = new Post({
    title:'Football',
    content:'Football is a family of team sports that involve, to varying degrees, kicking a ball to score a goal. Unqualified, the word football normally means the form of football that is the most popular where the word is used. Sports commonly called football include association football (known as soccer in some countries); gridiron football (specifically American football or Canadian football); Australian rules football; rugby football (either rugby league or rugby union); and Gaelic football.[1][2] These various forms of football are known as football codes There are a number of references to traditional, ancient, or prehistoric ball games played in many different parts of the world.[3][4][5] Contemporary codes of football can be traced back to the codification of these games at English public schools during the 19th century.[6][7] The expansion of the British Empire allowed these rules of football to spread to areas of British influence outside the directly controlled Empire.[8] By the end of the 19th century, distinct regional codes were already developing: Gaelic football, for example, deliberately incorporated the rules of local traditional football games in order to maintain their heritage.[9] In 1888, The Football League was founded in England, becoming the first of many professional football competitions. During the 20th century, several of the various kinds of football grew to become some of the most popular team sports in the world'
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

app.use(express.static('public'));
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));

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
                        res.render('post',{post,isLogin,name:"App Brewery",email:'appbrewery@gmail.com'})
                    }
                    else{
                        User.findOne({ _id: post.User }, function (err, user) {
                            const firstname = user.firstName;
                            const lastname = user.lastName;
                            const name = firstname +' ' + lastname;
                            res.render('post',{post,isLogin,name,email:user.emailID})
                        });
                    }
                   
                }
            })
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
        let i;
        for(i=0;i<users.length;i++)
        {  const person = users[i];

            if(person.emailID===email||person.password==-password)
              {   isLogin=true;
                  userId=person._id;
                  res.redirect('/compose');
                  break;
              }
          
        }
        if(i==users.length)
        {
            res.send('<h2 style="color: red;">Email address and Password does not match <a href="/userlogin">Login Again</a></h2>')
                     
        }
       }
   })
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})
app.post('/signup',(req,res)=>{

    const {firstName,lastName,Email,password} = req.body;
    let finditem = false;
    User.find((err,users)=>{
        if(!err)
        {
    
         let i;
         for(i=0;i<users.length;i++)
         {  const person = users[i];
            console.log(person.firstName);

            if(person.emailID===Email)
                   {   
                       console.log('exist');
                       res.send('<h2 style="color: red;">Email already in use <a href="/signup">Use another email</a></h2>')
                       break;
                   }
         }
         if(i==users.length)
         {
             console.log('you can create new user');
             const newUser = new User({
                firstName,
                lastName,
                emailID:Email,
                password,
             })
             newUser.save();
             res.redirect('/userlogin');
         }
        }
    })    
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