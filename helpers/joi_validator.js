const Joi = require('joi');
exports.login = function (req, res, next) {
  Joi.validate({

    "mobileNo":req.body.mobileNo,
    "password":req.body.password
  }, {
    mobileNo:Joi.string().min(10).max(10).required(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  }, (err, value) => {
        if (err) {
          return res.status(200).json({
            message: err.details[0].message,
            httpCode: 200,
            code: 400,
            errorName: err.name
          });
        } else {
          //  cb(null, false)
          // console.log('hi');
          next();
         } }
         )
  }

  //Registration validation


  exports.registration = function (req, res, cb) {
    Joi.validate({
      "name":req.body.name,
      "email":req.body.email,
      "password":req.body.password,
      "mobileNo":req.body.mobileNo,
      "countryCode":req.body.countryCode

    }, {
      name: Joi.string().min(3).required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      mobileNo:Joi.string().min(10).max(10).required(),
      countryCode:Joi.string().max(4).required()
    }, (err, value) => {
          if (err) {
            return res.status(200).json({
              message: err.details[0].message,
              httpCode: 200,
              code: 400,
              errorName: err.name
            });
          } else {
            cb(null, true)
           } }
           )
    }
//update password
exports.updatePassword = function (req, res, cb) {
  Joi.validate({

    "password":req.body.password,


  }, {
  
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    
  }, (err, value) => {
        if (err) {
          return res.status(200).json({
            message: err.details[0].message,
            httpCode: 200,
            code: 400,
            errorName: err.name
          });
        } else {
          cb(null, true)
         } }
         )
  }

      //update name

      exports.updateName = function (req, res, cb) {
        Joi.validate({
      
         
          "name":req.body.name
        }, {

          name: Joi.string().min(3).required()

        }, (err, value) => {
              if (err) {
                return res.status(200).json({
                  message: err.details[0].message,
                  httpCode: 200,
                  code: 400,
                  errorName: err.name
                });
              } else {
                cb(null, true)
               } }
               )
        }

          //add contact

      exports.addContact = function (req, res, cb) {
        Joi.validate({
      
         
          "name":req.body.name,
          "mobileNo":req.body.mobileNo
        }, {

          mobileNo:Joi.string().min(10).max(10).required(),
          
          name: Joi.string().min(3).required()

        }, (err, value) => {
              if (err) {
                return res.status(200).json({
                  message: err.details[0].message,
                  httpCode: 200,
                  code: 400,
                  errorName: err.name
                });
              } else {
                cb(null, true)
               } }
               )
        }


   