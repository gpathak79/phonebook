const mongoose =require('mongoose');
var Schema = mongoose.Schema;

//Structure of user post

userPost = new Schema({

    userId:String,
    postContent:String,
    createdOn:String,
    status:Boolean



});
module.exports = mongoose.model('post',userPost);