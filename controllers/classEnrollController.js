var counter = 0;
const classModel = require('../models/Class');
const enrollmentModel = require("../models/Enrollment");
const classEnrollmentModel = require("../models/ClassEnrollment");

const config_secret = require("../config.json").db.secret;
const ObjectId = require("mongoose").Types.ObjectId;

exports.defaultFunction=async(req,res)=>{
    console.log("request received, counter = " + counter);
    counter+=1;
    res.send({classEnrollment:counter});
}

exports.enrollClass = async(req, res)=>{
    const data = req.body;
    let user_id = data.user_id;
    let class_id = data.class_id;

    let enrollment = await enrollmentModel.findOne({user_id});
    let gymClass = await classModel.findById(class_id);

    if( !enrollment ||  enrollment.expiration_time < gymClass.start_time){
        res.statusCode="401";
        res.send({error: " you must have and active membership during the Class timing to enroll."});
    }else{
        let newClassEnrollment = new classEnrollmentModel({
            class_id,
            user_id
        });

        let error = await newClassEnrollment.validateSync();
   if(error){
    res.statusCode = 400;
    res.json(error.errors);
   }else{
    newClassEnrollment.save().then((doc)=>{
        // console.log("Data Inserted : " + doc);
        res.statusCode =201;
        res.send({classEnrollment : newClassEnrollment});
    }).catch((err)=>{
        console.log("Error Occured while saving the Class enrollment!!!!");
        console.log(err);
        
        res.sendStatus(500);
    });
   }  

}


    
    // here can access new record  via - >  newMembership
    // res.statusCode =201;
    // res.send({membership : newMembership});
}

exports.getById = async(req, res)=>{
    // console.log(req.query.id);
    if(ObjectId.isValid(req.query.id)){
        classEnrollmentModel.findById( req.query.id, {__v : 0})
        .then((doc)=>{
        //    console.log("membership found");
           res.send({doc});
        })
        .catch(error=>{
           console.log("error Occured fetching Class enrollment with Id!!!");
           console.log(error.message);
           res.sendStatus(500);
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid Class enrollment Object Id format"});
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
    var data =  await classEnrollmentModel.find({},{"__v": 0}).populate("class_id");
    // console.log(data);
    res.json(data);
    // res.send(200);
}



exports.deleteById = async(req, res)=>{
    //   console.log(req.query.id);
     if(ObjectId.isValid(req.query.id)){
        classEnrollmentModel.deleteOne( {_id:req.query.id})
        .then((doc)=>{
            console.log(doc.deletedCount + " - class enrollment deleted using ID");
           res.sendStatus(200);
        })
        .catch(error=>{
           console.log("error Occured deleting class enrollment  with Id!!!");
           console.log(error.message);
           res.statusCode = 500;
           res.send({error:error.message});
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid class Object Id formate"});
    }
     
}
exports.deleteAll = async(req,res)=>{
    if(req.params.secret === config_secret){
        classModel.deleteMany().catch(err=>{
            console.log("Error occured on deletion of class enrollment records !!!");
            res.sendStatus(500);
        }).then((docs)=>{
            // console.log(docs.deletedCount);
            console.log(docs.deletedCount + " classe enrollments deleted successfully !!!!");
            res.sendStatus(200);
        });
    }else{
        res.statusCode = 401;
        res.send({error : "You don't know the secret to delete all the class document !!!"});
    }
    
}

exports.getUnEnrolledClasses = async(req,res)=>{
     // console.log(req.query.id);
     if(ObjectId.isValid(req.query.id)){
        classEnrollmentModel.find( {user_id:req.query.id}).select("class_id -_id")
        .then((enrolledClassId)=>{
        let arr = [];
        enrolledClassId.forEach(e=> arr.push(e.class_id));
        // res.send(arr);

           classModel.find({_id :{$nin: arr}})
           .then((classes)=>{
                res.send(classes);
           }).catch(error=>{
            console.log("error Occured fetching Class enrollment with Id!!!");
            console.log(error.message);
            res.sendStatus(500);
            });
        })
        .catch(error=>{
           console.log("error Occured fetching Class enrollment with Id!!!");
           console.log(error.message);
           res.sendStatus(500);
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid user Object Id format"});
    }
     
}

exports.getEnrolledClasses = async(req,res)=>{
    // console.log(req.query.id);
    if(ObjectId.isValid(req.query.id)){
       classEnrollmentModel.find( {user_id:req.query.id}).populate("class_id")
       .then((enrolledClass)=>{
       
       res.send(enrolledClass);

         
       })
       .catch(error=>{
          console.log("error Occured fetching Class enrollment with Id!!!");
          console.log(error.message);
          res.sendStatus(500);
       });
   }else{
       res.statusCode=400;
       res.send({error:"Invalid user Object Id format"});
   }
    
}
