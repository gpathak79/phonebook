const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
env = require('dotenv').config();
global.path=require('path');
global.fs=require('fs');
global.multer=require('multer');

global.multiparty=require('multiparty');
global.Joi = require('joi');
global.jwt = require("jsonwebtoken");
global.bcrypt = require('bcryptjs');
global.geodist = require('geodist');
global.User = require("./models/users");
global.Address = require("./models/address");
global.contactDetail = require("./models/contactDetail");
global.friendConnection = require("./models/friendConnection");
global.friendRequest = require("./models/friendRequest");
global.userPost = require("./models/userPost");
global.CodesAndMessages = require("./helpers/error-sucess-codes-messages");
global.Role = require("./helpers/roles");
mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DBCONN, { useNewUrlParser: true, useCreateIndex: true });
const apiUser = require('./routes/api.user')(router);
const app = express();
app.use(bodyParser.json({ limit: '5000mb' }));
app.use(bodyParser.urlencoded({ limit: '5000mb', extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authtoken, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "*");
    console.log('--------------------------------request Details----------------------------------------', req.originalUrl);
    console.log('-----------------------------------------ENDS------------------------------------------');
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
});
app.use('/api/user', apiUser);
app.use(function (req, res, next) {
    const err = new Error('Bad Request');
    err.status = 400;
    console.log('err', err);
    res.json({ message: 'Bad Request', code: 400, result: {} });
    return;
});

process.on('uncaughtException', function (err) {
    console.log(err);
});
module.exports = app;