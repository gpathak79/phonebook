
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
EmpSchema = new Schema({
    name : String,
    email:String,
    password:String,
    mobileNo:String,
    countryCode:String
    

});
module.exports = mongoose.model('users', EmpSchema);