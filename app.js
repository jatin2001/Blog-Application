const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();

const homeStartingContent = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for will uncover many web sites still in their infancy.';
const aboutContent = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.";
const contactContent ="At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus";
let isAdmin = false;
app.use(express.static('public'));
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));

const posts = [];
const loginArray =[{email:'jatinkumarjk2001@gmail.com',password:'9873804639'}];

app.get('/',(req,res)=>{
    res.render('home',{content:homeStartingContent,posts});
})
app.get('/about',(req,res)=>{
    res.render('about',{aboutContent});
})

app.get('/contact',(req,res)=>{
    res.render('contact',{contactContent});
})

app.get('/compose',(req,res)=>{
    res.render('compose',{isAdmin});
})

app.post('/compose',(req,res)=>{
    const obj = {
        post:req.body.post,
        title:req.body.title,
    }
    posts.push(obj);
    res.redirect('/');
})


app.get('/posts/:post',(req,res)=>{
    const urlPost = _.lowerCase(req.params.post);
    posts.forEach(item=>{
        if(_.lowerCase(item.title)===urlPost)
        {
            res.render('post',{Title:item.title,content:item.post});
        }
    })
})

app.get('/adminlogin',(req,res)=>{
    res.render('Login')
})

app.post('/adminlogin',(req,res)=>{
    let {email,password} = req.body;
    loginArray.forEach(item=>{
        if(email===item.email && password === item.password)
        {   isAdmin=true;
            res.redirect('/compose');
        }
    })
})

app.listen(3000,()=>{
    console.log('server run on port 3000');
})