var mongoose = require('mongoose');

var Schema = mongoose.Schema;

eventSchema = new Schema({

    feedType:String,
    eventType:String,
    zipCode:String,
    geoLocation:[Number],
    eventDate:Date

});
 
module.exports = mongoose.model('events',eventSchema);


