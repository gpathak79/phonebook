const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Structure of Friend request

friendRequest = new Schema({

    senderId:String,
    recieverId:String,
    cretedOn:String
});


module.exports = mongoose.model('request',friendRequest);