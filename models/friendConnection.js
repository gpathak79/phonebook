const mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Structure of Friend Connection

friendConnection = new Schema({

        userId:String,
        recieverid:String,
        createdOn:String,
        status:Boolean



});
module.exports = mongoose.model('friendconnection',friendConnection);