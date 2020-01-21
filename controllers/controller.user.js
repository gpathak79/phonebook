// "use strict"


// exports.Login = (req, res) => {
//     try {
    
//         /* check user mobile in database*/
//         var mobileCheck = new Promise(function (resolve, reject) {
//             User.find({'mobile': req.body.mobile}, function (err, results) {
//                 if (err) {
//                     reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
//                 } else {
//                     !results.length ? reject({ 'message': 'Not found.', 'code': 210,"httpCode":200}) : resolve(results[0]);
//                 }
//             })
//         });

//                  //Account Check in database
//         var driverAccountOTP = new Promise(function (resolve, reject) {
//             otpMaster.find({'mobile': req.body.mobile}, function (err, results) {
//                 if (err) {
//                     reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
//                 } else {
//                     resolve(results[0])
//                 }
//             })
//         });
//         Promise.all([mobileCheck, driverAccountOTP]).then(function (results) {
//                 if (req.body.password!==''){
//                 if (results[0].password!==req.body.password){
//                    return res.status(200).json({ 'message': 'Password does not match.', 'code': 210,"httpCode":200});
//                 }
//                 }

//                 if (req.body.otp!==''){
//                 if (results[1].otp!==req.body.otp){
//                    return res.status(200).json({ 'message': 'OTP does not match.', 'code': 210,"httpCode":200});
//                 }
//                 }
//             var token = jwt.sign({
//                 "id": results[0]._id
//             }, process.env.JWTPASS, {
//                     "expiresIn": process.env.JWTEXPIRETIME
//                 });
//             res.status(200).json({ 'message': 'Sucess.', 'code': 200,"httpCode":200,data:results[0],"token":token});
//         }).catch(function (err) {
//             console.log('errerrerrerr', err)
//             res.status(err.httpCode).json(err);
//         });        
//     } catch (e) {
//         res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
//         console.log('catch login', e);
//     }
// }

//user registration

exports.Registration = (req, res) => {
    try {
        //Check mobile no. in database
        const mobileCheck = new Promise( (resolve, reject) => {
            User.find({'mobileNo': req.body.mobileNo}, (err, results) => {
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? resolve(1) : reject({ 'message': 'Mobile Number already Registered', 'code': 210,"httpCode":200})
                }
            });
        });
        //check email in database
        const emailCheck = new Promise( (resolve, reject) => {
            User.find({'email': req.body.email}, (err, results) => {
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? resolve(1) : reject({ 'message': 'Email already Registered', 'code': 210,"httpCode":200})
                }
            });
        });
        Promise.all([mobileCheck, emailCheck]).then(() => {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.send({'code':400,'message':'User Error.','data':""});
                } else {
                    User.create({
                        "name": req.body.name,
                        "email": req.body.email,
                        "password": hash,
                        "mobileNo":req.body.mobileNo,
                        "countryCode": req.body.countryCode,
                        
                        "image": req.body.image,
                    }, (err, results) => {
                        if(err) {
                            if(err) return res.send({'code':210,'message':'Database error.','data':[]});
                        } else {
                            res.send({'code':200,'message':'Sucess.','data':{"Name":results.name,"Email":results.email,"Phone Number":results.phoneNumber,"Status":results.isStatus}});
                        }
                    });
                }
            })
        }).catch(function (err) {
                        console.log('errerrerrerr', err)
                        res.status(err.httpCode).json(err);
                    }); 
    } catch (err) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', err);
    }
}


exports.Login = (req, res) => {
    try {
    
        /* check user mobile in database*/
        var mobileCheck = new Promise(function (resolve, reject) {
            User.find({'mobileNo': req.body.mobileNo}, function (err, results) {
                if (err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                } else {
                    !results.length ? reject({ 'message': 'Not found.', 'code': 210,"httpCode":200}) : resolve(results[0]);
                }
            })
        });
        Promise.all([mobileCheck]).then(function (results) {


            bcrypt.compare(req.body.password, results[0].password, function(err, bcrypt_res) {

                console.log(results[0].password);
                console.log(results);
                
                if(err) return res.send({'code':210,'message':'Database error.','data':[]});
                if(bcrypt_res)
                {
                    var token = jwt.sign({
                        id: results[0]._id
                    }, process.env.JWTPASS, {
                            expiresIn: process.env.JWTEXPIRETIME
                        });
                    res.send({'code':200,'message':'Sucess.','data':{"Name":results.name,"Email":results[0].email,"Phone Number":results[0].mobileNo,"Status":results[0].isStatus},"auth":token});
                }
                else {
                    res.send({'code':410,'message':'Invalid Username or Password'});
                }
            });
         
              
        }).catch(function (err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });        
    } catch (e) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', e);
    }
}

//Updaate User

exports.UpdateUser = (req,res)=>{

    try{

             //check user name in database
             var username = new Promise(function (resolve, reject) {
                User.find({'_id': req.userId}, function (err, results) {
                    if (err) {
                        reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                    } else {
                        !results.length ? reject({ 'message': 'Id Already Exists.', 'code': 210,"httpCode":200}) : resolve(results[0]);
                    }
                })
            });
           

        
        Promise.all([username]).then(function (results) {

            


            User.updateOne({'_id': req.userId}, {$set:{'name':req.body.name} }, function (err,result){
                if (err) 
                { 
                res.send({'code':201,'message':err.message});
                }
                else{
                    User.findOne({ '_id': req.userId}, function(err, re){
                    if (err){
                
                  res.send({'code':201,'message':err.message});
                }
                else
                {
            
                  res.send({'code':200,'message':'update sucessfully','data':re})
                }
                
                });
            
              }
            });
         
              
        }).catch(function (err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });  



       


    }
    catch{


    }
}

//Update Password


exports.UpdatePassword = (req, res) => {
    try {
        console.log('jij',req.userId)
        /* check user mobile in database*/
        var password = new Promise(function (resolve, reject) {
            User.find({'_id': req.userId}, function (err, results) {
                if (err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                } else {
                    !results.length ? reject({ 'message': 'Id Already Exists.', 'code': 210,"httpCode":200}) : resolve(results[0]);
                }
            })
        });
       

      
        Promise.all([password]).then(function (results) {

            console.log(results);   


            User.updateOne({'_id': req.userId}, {$set:{'password':req.body.password} }, function (err,result){
                if (err) 
                { 
                res.send({'code':201,'message':err.message});
                }
                else{
                    User.findOne({ '_id': req.userId}, function(err, re){
                    if (err){
                
                  res.send({'code':201,'message':err.message});
                }
                else
                {
            
                  res.send({'code':200,'message':'update sucessfully','data':re})
                }
                
                });
            
              }
            });
         
              
        }).catch(function (err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });        
    } catch (e) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', e);
    }
}






