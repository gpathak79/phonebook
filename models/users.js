
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
userSchema = new Schema({
    name : String,      
    email:String,
    password:String,
    mobileNo:String, 
    countryCode:String,
    status:Boolean,
    imageURL: String,
    created:Date
    

});
module.exports = mongoose.model('users', userSchema);


