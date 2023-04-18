var counter = 0;
const userModel = require('../models/User');
const config_secret = require("../config.json").db.secret;
const ObjectId = require("mongoose").Types.ObjectId;

exports.defaultFunction=async(req,res)=>{
    console.log("request received, counter = " + counter);
    counter+=1;
    res.send({User:counter});
}

exports.addUser = async(req, res)=>{
    const data = req.body;
    const newUser = new userModel({
        name : data.name,
        address : data.address ? data.address : null,
        phone_no : data.phone_no,
        role : data.role,
        email_id : data.email_id,
        password : data.password
    });    

    let error = await newUser.validateSync();
   if(error){
    res.statusCode = 400;
    res.json(error.errors);
   }else{
    newUser.save().then((doc)=>{
        // console.log("Data Inserted : " + doc);
        res.statusCode =201;
        res.send({User : newUser});
    }).catch((err)=>{
        console.log("Error Occured while saving the User document !!!!");
        console.log(err);
        
        res.sendStatus(500);
    });
   }  
    // here can access new record  via - >  newMembership
    // res.statusCode =201;
    // res.send({membership : newMembership});
}

exports.getById = async(req, res)=>{
    // console.log(req.query.id);
    if(ObjectId.isValid(req.query.id)){
        userModel.findById( req.query.id, {__v : 0})
        .then((doc)=>{
        //    console.log("membership found");
           res.send({user:doc});
        })
        .catch(error=>{
           console.log("error Occured fetching User  with Id!!!");
           console.log(error.message);
           res.sendStatus(500);
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid User Object Id formate"});
    }
     
    
    // if(membership){
    //     res.send({membership});
    // }else{
    //     res.statusCode = 404;
    //     res.send({error: "No record found with Id - " + req.query.id});
    // }
    // res.sendStatus(200);
}

exports.getAll = async(req,res)=>{
    var data =  await userModel.find({},{"__v": 0});
    // console.log(data);
    res.json(data);
    // res.send(200);
}

exports.update = async(req, res)=>{
    let data = req.body;
    if(ObjectId.isValid(data.id)){
        userModel.findOneAndUpdate({_id:data.id}, {
            name : data.name,
            address : data.address ? data.address : null,
            phone_no : data.phone_no,
            role : data.role,
            email_id : data.email_id,
            password : data.password
        }, {new : true}).then((doc)=>{
            //console.log("=========")
            //console.log(doc);

            if(doc){
                res.send({user : doc});
            }else{
                res.statusCode = 404;
                res.send({error : "User not find for the given Id"});
            }
            
        }).catch(error=>{
            console.log("error Occured while updating the User !!!");
            console.log(error.message);
            res.statusCode = 500;
            res.send({error:error.message});
        })
    }else{
        res.statusCode=400;
        res.send({error:"Invalid User Object Id formate !!!"});
    }
    
}

exports.deleteById = async(req, res)=>{
     // console.log(req.query.id);
     if(ObjectId.isValid(req.query.id)){
        userModel.deleteOne( {_id : req.query.id}, {__v : 0})
        .then((doc)=>{
            console.log(doc.deletedCount + " - User deleted using ID");
           res.sendStatus(200);
        })
        .catch(error=>{
           console.log("error Occured deleting User  with Id!!!");
           console.log(error.message);
           res.statusCode = 500;
           res.send({error:error.message});
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid User Object Id formate"});
    }
     
}
exports.deleteAll = async(req,res)=>{
    if(req.params.secret === config_secret){
        userModel.deleteMany().catch(err=>{
            console.log("Error occured on deletion of User records !!!");
            res.sendStatus(500);
        }).then((docs)=>{
            // console.log(docs.deletedCount);
            console.log(docs.deletedCount + " User deleted successfully !!!!");
            res.sendStatus(200);
        });
    }else{
        res.statusCode = 401;
        res.send({error : "You don't know the secret to delete all the User document !!!"});
    }
    
}
 