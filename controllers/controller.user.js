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



// function inputValidate(value)
// {
// const schema = {
//   name: Joi.string().min(3).required(),
//   email: Joi.string().email({ minDomainAtoms: 2 }),
//   password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
//   mobileNo:Joi.string().min(10).max(10),
//   countryCode:Joi.string()


// };

// const {error} = Joi.validate(value, schema)

//   return error;
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

                    results.length ? reject({ 'message': 'Mobile Number already Registered', 'code': 210,"httpCode":200}): resolve(1) 
                    console.log(results.length);
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

//Login User
exports.Login = (req, res) => {
    try {
    
        /* check user mobile in database*/
        var mobileCheck = new Promise(function (resolve, reject) {
            User.find({'mobileNo': req.body.mobileNo}, function (err, results) {


                console.log(results);
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

//Updaate User Name

exports.UpdateUser = (req,res)=>{

    try{

             //check user id in database
             var username = new Promise(function (resolve, reject) {
                User.find({'_id': req.userId}, function (err, results) {
                    if (err) {
                        reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                    } else {
                        !results.length ? reject({ 'message': 'Id Already Exists.', 'code': 210,"httpCode":200}) : resolve(results[0]);
                    }
                })
            });
           

        
        Promise.all([username]).then    (function (results) {

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
    catch (e) { 
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', e);
    }
}

//Update Password


exports.UpdatePassword = (req, res) => {
    try {
        console.log('jij',req.userId)
        /* check user id in database*/
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
    } catch (err) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', err);
    }
}




//Add Contacts

exports.AddContact=(req,res)=>{


    try{

        const mobileIdCheck = new Promise( (resolve, reject) => {
            contactDetail.find({'mobileNo': req.body.mobileNo}, (err, results) => {
              
             
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {

                    

                    !results.length ? resolve(1) : reject({ 'message': 'Mobile Number already Registered', 'code': 210,"httpCode":200})
                }
            });
        });
        const emailIdCheck = new Promise( (resolve, reject) => {
            contactDetail.find({'email': req.body.email}, (err, results) => {
              
             
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {

                        console.log(results);

                    !results.length ? resolve(1) : reject({ 'message': 'Email Id  already Registered', 'code': 210,"httpCode":200})
                }
            });
        });

    Promise.all([mobileIdCheck,emailIdCheck]).then((results) => {


         contactDetail.create({

                        "userId":req.userId,
                        "name":req.body.name,
                        "email":req.body.email,
                        "mobileNo":req.body.mobileNo,
                        "countryCode":req.body.countryCode
                        
                        
                        
                    }, (err, results) => {
                        if(err) {
                            if(err) return res.send({'code':210,'message':'Database error.','data':[]});
                        } else {
                            res.send({'code':200,'message':'Sucess.','data':{"userId":results.userId,"Name":results.name,"email":results.email,"mobileNo":results.mobileNo,"countryCode":results.countryCode,"Status":results.isStatus}});
                        console.log(results);
                        }
                    });
                
         
        }).catch(function (err) {   
                        console.log('errerrerrerr', err)
                        res.status(err.httpCode).json(err);
                    }); 
    } catch (err) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', err);
    }
}


//Update-Contact


exports.UpdateContact = (req, res) => {
    try {
        const contactIdCheck = new Promise((resolve, reject) => {
            contactDetail.find({'userId': req.userId, '_id': req.body.userId}, (err, results) => {
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? reject({ 'message': 'Contact Not Found', 'code': 210,"httpCode":200}) :
                    resolve(results[0]);
                }
            });
        });
        
           

        
            contactIdCheck
            .then((results) => {
              
                contactDetail.update({'_id': results._id, 'userId': req.userId}, {$set:{
                "name": req.body.name, 
                
                "email":req.body.email,
                "mobileNo":req.body.mobileNo,
                "countryCode":req.bodycountryCode
             }
                }, (err, result) => {
                if(err) {
                    if(err) return res.send({'code':210,'message':'Database error.','data':[]});
                } else {           
                    console.log('updatecontact',results);    
                    res.send({'code':200,'message':'Sucess.','data':{"Name":results.name,"Email":results.email,"mobileNo":results.mobileNo,"Status":results.isStatus}});
                }
            })
        })
            .catch(function (err) {
                console.log('errerrerrerr', err)
                res.status(err.httpCode).json(err);
            });
    } catch (err) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch editContact', err);
    }
}


//delete-Contact


exports.DeleteContact = (req, res) => {
    try {
        //check user id and contact id
        const DeleteId = new Promise((resolve, reject) => {
            contactDetail.find({'userId': req.userId, '_id': req.body.userId}, (err, results) => {
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? reject({ 'message': 'Contact Not Found', 'code': 210,"httpCode":200}) :
                    resolve(results[0]);
                }
            });
        });
           

            DeleteId
            .then((results) => {

                console.log('results',results);
          

            contactDetail.remove({
                _id : results._id
            }, function(err) {
                if (err)
                    res.send(err);
                else
                    res.send({'message':'Successfully! Employee has been Deleted.'});	
            });
        })
            .catch(function (err) {
                console.log('errerrerrerr', err)
                res.status(err.httpCode).json(err);
            });
    } catch (err) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch editContact', err);
    }
}






//Get All-Contact


exports.getAllContact = (req, res) => {
    try {
            const getId = new Promise((resolve, reject) => {

                //check user id and limit
                // let pageLimit = parseInt(req.query.limit);
                var pageNo = parseInt(req.query.pageNo)
                 var size = parseInt(req.query.size)
                 var query={};

                 if(pageNo < 0 || pageNo === 0) {
                    response = {"error" : true,"message" : "invalid page number, should start with 1"};
                    return res.json(response)
              }

                //  query.skip = size * (pageNo - 1)
                // query.limit = size

                console.log(query.skip);
            contactDetail.find({'userId': req.userId,}, query,(err, results) => {
              
                if(err) {

                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {
                    
                    !results.length ? reject({ 'message': 'Contact Not Found', 'code': 210,"httpCode":200}) :
                    resolve(results);
                    
                  }
            
            }).limit(size).skip(size * (pageNo - 1));
        })
            getId.then((results) => {

                
                res.send({'code':200,'message':'Success','data':results,'isNext':true,'Limit':3});
            })
                
                
            .catch(function (err) {
                console.log('errerrerrerr', err)
                res.status(err.httpCode).json(err);
            });
    } catch (err) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch editContact', err);
    }
}






//upload Image

exports.mediaUpload = (req, res) => {
    try {
var form =new multiparty.Form();
form.parse(req, function(err, rawBody, files){
var imageProcessing = new Promise((resolve, reject) => {
    
    if((files.file) && files.file.length > 0) {
        var fileName = '';
        var newfilename = '';
        var ext = '';
        fileName = files.file[0].originalFilename;
        console.log(fileName);
        ext = path.extname(fileName);
        newfilename = Date.now() + ext;
        console.log(newfilename);
//console.log(newfilename);
fs.readFile(files.file[0].path, function(err, fileData) {

    console.log(fileData);
    if (err) {
       
        reject({httpCode: 400,code: 400,message: 'try again!'});
    }
    var pathNew = process.env.USERPROFILEIMAGEPATH + newfilename;
    console.log(pathNew);
    fs.writeFile(pathNew, fileData, function(err) {
        if (err) {
            console.log('err',err)
            reject({httpCode: 400,code: 400,message: 'Try again!'});
        }
        resolve(process.env.USERPROFILEPATHVIEW + newfilename);
    });
});
}
else{
    reject({httpCode: 400,code: 400,message: 'image not send!'});
}
});
Promise.all([imageProcessing]).then(function(results) {

    console.log(results);

    User.update({ '_id': req.userId}, {$set:{
       "imageURL":results[0]
     }
        }, (err, result) => {
        if(err) {
            if(err) return res.send({'code':210,'message':'Database error.','data':[]});
        } else {               
            
         res.status(200).json({ 'code': 200, 'message': 'Sucess!.','url': results[0]});
        }
    })





    }).catch(function(err) {
console.log('catch err',err);
res.status(err.httpCode).json(err);
});
})
    } catch (e) {
console.log('catch profileNew',e);
    }
}

    //Event Filter

  exports.eventFilter = (req, res) => {
    try {
var isEmpty = function (value) {
    if(value === undefined ||
        value === null ||
        (typeof(value) === 'object' && Object.keys(value).length === 0) ||
        (typeof(value) === 'string' && value.trim().length === 0))

        
        return 1;
        
    else
    return 0;
}
        const contactIdCheck = new Promise((resolve, reject) => {
                console.log(isEmpty(req.query.feedType));
            if(isEmpty(req.query.feedType) || isEmpty(req.query.eventType)) {
                reject({httpCode: 400,code: 400,message: 'try again!'});
            }
            else {
                let updateObj={};
               Object.keys(req.query).forEach((key) => {
                if(!(key=='lat'||key=='lang'||key=='maxDistance')) {
                    if(!isEmpty(req.query[key])) {
                        updateObj[key]=req.query[key];
                    }
                }
            });
            if(!isEmpty(req.query.lat) && !isEmpty(req.query.lang) && !isEmpty(req.query.maxDistance)) {
                
                events.find({$and:[updateObj, {"geoLocation":   {$near :{$geometry : {type : "Point" ,coordinates : [req.query.lat,req.query.lang]},$maxDistance : req.query.maxDistance}}}]},(err, results) => {

                    console.log(results);

             
                    
                   
                    if(err) {
                        reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                    } else {
                        !results.length ? reject({ 'message': 'Contact Not Found', 'code': 210,"httpCode":200}) :
                        resolve(results);
                    }
                });
            }
            else {

                
                events.find(updateObj,(err, results) => {

                    console.log(results);
                   
                    if(err) {
                        reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                    } else {
                        !results.length ? reject({ 'message': 'Contact Not Found', 'code': 210,"httpCode":200}) :
                        resolve(results);
                    }
                });
            }
            
            }
            
        });
            contactIdCheck.then((results) => {


                // console.log(results);

                
                res.send({'code':200,'message':'Success','data':results});
            })
                
                
            .catch(function (err) {
                console.log('errerrerrerr', err)
                res.status(err.httpCode).json(err);
            });
    } catch (err) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch editContact', err);
    }
}






















  


  






