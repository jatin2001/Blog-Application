const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const postSchema = new mongoose.Schema({
    title:String,
    content:String,
    UserId:String,
})

const Post = mongoose.model('Post',postSchema);
module.exports = {postSchema,Post};