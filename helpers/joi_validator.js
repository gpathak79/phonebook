const Joi = require('joi');
exports.login = function (req, res, cb) {
  Joi.validate({}, {}, (err, value) => {
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