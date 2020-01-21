
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
contactSchema = new Schema({
    userId:String,
    name : String,      
    email:String,
    mobileNo:String, 
    countryCode:String,
    status:Boolean,
    createdOn:Date

    

});
module.exports = mongoose.model('contact', contactSchema);