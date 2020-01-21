var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Address Schema Structure

addressSchema = new Schema({

    userId:String,
    streetaddress:String,
    state:String,
    city:String,
    zipcode:Number,
    createdOn:{type:String,default:Date.now()},
    status:String,
    geoLocation: {
        latitude: String,
        longitude: String
      }
});
 module.exports = mongoose.model('address',addressSchema);
