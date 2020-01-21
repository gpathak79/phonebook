"use strict";
module.exports = (router) => {
    const auth = require("../helpers/api-auth"),/* Authorization module*/
        UserCltr = require("../controllers/controller.user");/* User controller*/
    router.post('/user-login', auth.isAuthenticated, UserCltr.Login);
    router.post('/user-registeration', auth.isAuthenticated, UserCltr.Registration);
    router.post('/update-password', auth.isAuthenticated, auth.checkToken, UserCltr.UpdatePassword);
    router.post('/update-user',auth.isAuthenticated,auth.checkToken,UserCltr.UpdateUser);
    
    return router;
}
