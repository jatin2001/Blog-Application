const mongoose = require('mongoose');
const {Post,postSchema} = require('./Post');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    googleId:String,
    blog:[postSchema],
    facebookId:String,
    secretToken:String,
    active:Boolean,
})
userSchema.plugin(findOrCreate);
const User = mongoose.model('User',userSchema);

module.exports = User;