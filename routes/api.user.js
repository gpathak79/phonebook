"use strict";
module.exports = (router) => {
    const auth = require("../helpers/api-auth"),/* Authorization module*/
        UserCltr = require("../controllers/controller.user");/* User controller*/
        let UserVal =require('../helpers/joi_validator');
        let UserUpld = require('../helpers/common-service'); /*Media Upload */
    router.post('/user-login', auth.isAuthenticated,UserVal.login, UserCltr.Login);
    router.post('/user-registeration', auth.isAuthenticated, UserVal.registration, UserCltr.Registration);
    router.post('/update-password', auth.isAuthenticated,UserVal.updatePassword, auth.checkToken, UserCltr.UpdatePassword);
    router.post('/update-user',auth.isAuthenticated,UserVal.updateName,auth.checkToken,UserCltr.UpdateUser);
    router.post('/add-contact',auth.isAuthenticated,UserVal.addContact,auth.checkToken,UserCltr.AddContact);
    router.post('/update-contact',auth.isAuthenticated,UserVal.addContact,auth.checkToken,UserCltr.UpdateContact);
    router.delete('/delete-contact',auth.isAuthenticated,auth.checkToken,UserCltr.DeleteContact);
    router.get('/get-contact',auth.isAuthenticated,auth.checkToken,UserCltr.getAllContact);
    router.post('/upload-image',auth.isAuthenticated,auth.checkToken,UserCltr.mediaUpload);
    return router;
}
