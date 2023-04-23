var counter = 0;
const enrollmentModel = require('../models/Enrollment');
const membershipModel = require("../models/Membership");
const config_secret = require("../config.json").db.secret;
const ObjectId = require("mongoose").Types.ObjectId;

exports.defaultFunction=async(req,res)=>{
    console.log("request received, counter = " + counter);
    counter+=1;
    res.send({Enrollment:counter});
}

exports.getAll = async(req,res)=>{
    enrollmentModel.find({},{"__v": 0})
    .populate('user_id')
    .populate('membership_id')
    .then((data)=>{
        res.json(data);
    })
    .catch(error=>{
        console.log("Error during fetching all enrollments !");
        console.log(error.message);
        res.statusCode = 500;
        res.send({error : error.message});
    });
    // console.log(data);
    // res.json(data);
    // res.send(200);
}

exports.addEnrollment = async(req,res)=>{
    const {user_id, membership_id}  = req.body;
    let membership;
     try{
        membership= await membershipModel.findById(membership_id);
     }catch(err){
        console.log("Error fetching membership using Id for enrollment !!");
        console.log(err.message);
        res.statusCode(500);
        res.send({error: err.message});
     }
     let exp = new Date();
     exp.setDate(exp.getDate()+membership.duration);

     const newEnrollment = new enrollmentModel({
        user_id: user_id,
        membership_id : membership_id,
        expiration_time : exp
     });

     let error = await newEnrollment.validateSync();
     if(error){
      res.statusCode = 400;
      res.json(error.errors);
     }else{
      newEnrollment.save().then((doc)=>{
          // console.log("Data Inserted : " + doc);
          res.statusCode =201;
          res.send({enrollment : newEnrollment});
      }).catch((err)=>{
          console.log("Error Occured while saving the Enrollment !!!!");
          console.log(err);
          
          res.sendStatus(500);
      });
     }  
}

exports.getById = async(req, res)=>{
    // console.log(req.query.id);
    if(ObjectId.isValid(req.query.id)){
        enrollmentModel.findById( req.query.id, {__v : 0})
        .then((doc)=>{
        //    console.log("membership found");
           res.send({Enrollment:doc});
        })
        .catch(error=>{
           console.log("error Occured fetching Enrollment  with Id!!!");
           console.log(error.message);
           res.sendStatus(500);
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid Enrollment Object Id formate"});
    }
     
    
    // if(membership){
    //     res.send({membership});
    // }else{
    //     res.statusCode = 404;
    //     res.send({error: "No record found with Id - " + req.query.id});
    // }
    // res.sendStatus(200);
}

exports.update = async(req, res)=>{
    let data = req.body;
    if(ObjectId.isValid(data.id)){
        enrollmentModel.findOneAndUpdate({_id:data.id}, {
            user_id: data.user_id,
            membership_id : data.membership_id,
            expiration_time : data.expiration_time
        }, {new : true}).then((doc)=>{
            //console.log("=========")
            //console.log(doc);

            if(doc){
                res.send({Enrollment : doc});
            }else{
                res.statusCode = 404;
                res.send({error : "Enrollment not find for the given Id"});
            }
            
        }).catch(error=>{
            console.log("error Occured while updating the Enrollment !!!");
            console.log(error.message);
            res.statusCode = 500;
            res.send({error:error.message});
        })
    }else{
        res.statusCode=400;
        res.send({error:"Invalid Enrollment Object Id formate !!!"});
    }
    
}

exports.deleteById = async(req, res)=>{
     if(ObjectId.isValid(req.query.id)){
        enrollmentModel.deleteOne( {_id : req.query.id}, {__v : 0})
        .then((doc)=>{
            console.log(doc.deletedCount + " - Enrollment deleted using ID");
           res.sendStatus(200);
        })
        .catch(error=>{
           console.log("error Occured deleting Enrollment  with Id!!!");
           console.log(error.message);
           res.statusCode = 500;
           res.send({error:error.message});
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid Enrollment Object Id formate"});
    }
}

exports.deleteAll = async(req,res)=>{
    if(req.params.secret === config_secret){
        enrollmentModel.deleteMany().catch(err=>{
            console.log("Error occured on deletion of Enrollment records !!!");
            res.sendStatus(500);
        }).then((docs)=>{
            // console.log(docs.deletedCount);
            console.log(docs.deletedCount + " Enrollment deleted successfully !!!!");
            res.sendStatus(200);
        });
    }else{
        res.statusCode = 401;
        res.send({error : "You don't know the secret to delete all the Enrollment document !!!"});
    }
    
}

