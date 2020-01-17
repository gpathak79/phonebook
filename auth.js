var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
    function (username, password, callback) {
        if (process.env.AUTHUSERNAME === username && process.env.AUTHPASSWORD === password) {
            return callback(null, true);
        } else {
            return callback(null, false);
        }
    }
));



exports.isAuthenticated = passport.authenticate('basic', { 'session': false });



exports.checkToken = (req, res, next) => {
    jwt.verify(req.headers.authtoken, process.env.JWTPASS, function (err, decoded) {
        if (err) {
            return res.status(200).json({
                httpCode: 200,
                code: 302,
                message: 'Please login again.'
            });
        }
        else {
            req.userId = decoded.id;
            next();
        }
    })
}