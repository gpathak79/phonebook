var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
env = require('dotenv').config();
router = express.Router();
global.jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const Joi = require('joi');

 //validating the input

 function inputValidate(value)
 {
 const schema = {
   name: Joi.string().min(3).required(),
   email: Joi.string().email({ minDomainAtoms: 2 }),
   password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
   mobileNo:Joi.string().min(10).max(10),
   countryCode:Joi.string()


};

const {error} = Joi.validate(value, schema)

   return error;
}

function loginValidate(value)
{
const schema = {
  
  email: Joi.string().email({ minDomainAtoms: 2 }),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  


};

const {error} = Joi.validate(value, schema)

  return error;
}



var port     = process.env.PORT || 3000;
app.use(express.json());

var Authorization = require('./auth');

var user = require('./model/user');

//get all employee data from db
app.get('/api/phonebook',Authorization.isAuthenticated,(req, res)=> {
	user.find({},function(err, result) {
		if (err){
      res.send({'code':201,'message':'Datbase error',data:[]});
    }else{

      res.send({'code':200,'message':'Success','data':result});
      }
    

	});
});
// userRegistration Api 

app.post('/api/phonebook/register',Authorization.isAuthenticated,(req,res)=>{

  const error=inputValidate(req.body);
  if(error) return res.send({'code':400,'meesage':error.details[0].message});
  
	 user.findOne({ mobileNo: req.body.mobileNo }, function(err, results){
    if (results) {
        return res.status(400).send('That user already exisits!');
    }

    else
    {    
      bcrypt.hash(req.body.password, 10, function(err, hash) {
  user.create({'name':req.body.name,'email':req.body.email,'password':hash,'mobileNo':req.body.mobileNo,'countryCode':req.body.countryCode},function(err, userCreateResult) {

   
      // Store hash in database
   
		// if there is an error retrieving, send the error otherwise send data
		if (err){
      res.send(err)
    }
    else
    {
      res.send({'code':200,'message':'You have succesfully registered with us.','data':userCreateResult})
    }
  
  });
});
}
  });

});



//login user check
app.post('/api/phonebook/login-check',Authorization.isAuthenticated,(req,res)=>{



  const error=loginValidate(req.body);
  if(error) return res.send({'code':400,'meesage':error.details[0].message});
  console.log();
   
   

    // if there is an error retrieving, send the error otherwise send data
    
    user.findOne({ email: req.body.email }, function(err, results){
		if (err){
      res.send({'code':201,'message':'login unsucess'}); 
    }
    bcrypt.compare(req.body.password, results.password, function(err, result) {
     
    
    
    
      if(result) {
        
       
      var token = jwt.sign({
        id: results._id,
    }, process.env.JWTPASS, {
            expiresIn: process.env.JWTEXPIRETIME
        });
      res.send({'code':200,'message':'Login sucess.','data':results,authtoken:token})
    }
    else {
    res.send({'meesage':'password not match'});
     }
    
  

    });
    
	});
});


//update user data

//find by id


app.get('/api/phonebook/find-user',Authorization.isAuthenticated,(req, res)=> {
  let id = req.query.id;
  console.log('----->>',req.query);
	user.findById(id, function(err, result) {
		if (err){
        res.send({'code':201,'message':'cannot found'});
    }else{
      res.send({'code':200,'message':'sucess','data':[result]});
    }
  });
  
});

//update data

app.post('/api/phonebook/update-user',Authorization.isAuthenticated,Authorization.checkToken, (req,res) => {

  const error=inputValidate(req.body);
  if(error) return res.send({'code':400,'meesage':error.details[0].message});

  
  user.update({'_id': req.userId}, {$set:{'name':req.body.name} }, function (err,result){
    if (err) 
    {
    res.send({'code':201,'message':err.message});
    }
    else{
     user.findOne({ '_id': req.userId}, function(err, results){
		if (err){
    
      res.send({'code':201,'message':err.message});
    }
    else
    {

      res.send({'code':200,'message':'update sucessfully','data':results})
    }
    
	});

  }
});
});


// delete a employee by id
app.delete('/api/phonebook/:id',Authorization.isAuthenticated,(req, res)=> {
	console.log(req.params.id);
  

	user.remove({
		_id : req.params.id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Employee has been Deleted.');	
	});
});


mongoose.connect(database.url,{useUnifiedTopology: true,useNewUrlParser: true});

app.listen(port);
console.log("App listening on port : " + port);