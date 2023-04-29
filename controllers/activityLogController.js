var counter = 0;
const activityLogModel = require('../models/ActivityLog');
const config_secret = require("../config.json").db.secret;
const ObjectId = require("mongoose").Types.ObjectId;

exports.defaultFunction=async(req,res)=>{
    console.log("request received, counter = " + counter);
    counter+=1;
    res.send({Activity_log:counter});
}

exports.logActivity = async(req, res)=>{
    const data = req.body;
    const newLog = new activityLogModel({
        user_id : data.user_id,
        activity_type : data.activity_type,
        duration : data.duration
    });    

let error = await newLog.validateSync();
   if(error){
    res.statusCode = 400;
    res.json(error.errors);
   }else{
    newLog.save().then((doc)=>{
        // console.log("Data Inserted : " + doc);
        res.statusCode =201;
        res.send({activity : newLog});
    }).catch((err)=>{
        console.log("Error Occured while saving the Activity Log !!!!");
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
        activityLogModel.findById( req.query.id, {__v : 0})
        .then((doc)=>{
        //    console.log("membership found");
           res.send({actiivty:doc});
        })
        .catch(error=>{
           console.log("error Occured fetching Activity Log with Id!!!");
           console.log(error.message);
           res.sendStatus(500);
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid Activity log Object Id format"});
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
    var data =  await activityLogModel.find({},{"__v": 0});
    // console.log(data);
    res.json(data);
    // res.send(200);
}

// exports.getAllUpcoming = async(req,res)=>{
//     var data =  await classModel.find({
//         start_time :{
//             $gte: new Date()
//         }
//     },{"__v": 0});
//     // console.log(data);
//     res.json(data);
//     // res.send(200);
// }

// exports.update = async(req, res)=>{
//     let data = req.body;
//     if(ObjectId.isValid(data.id)){
//         classModel.findOneAndUpdate({_id:data.id}, {
//             instructor_id : data.instructor_id,
//             gym_id : data.gym_id,
//             name : data.name,
//             description : data.description ? data.description : null,
//             start_time : data.start_time,
//             end_time : data.end_time
//         }, {new : true}).then((doc)=>{
//             //console.log("=========")
//             //console.log(doc);

//             if(doc){
//                 res.send({class : doc});
//             }else{
//                 res.statusCode = 404;
//                 res.send({error : "Class not find for the given Id"});
//             }
            
//         }).catch(error=>{
//             console.log("error Occured while updating the class !!!");
//             console.log(error.message);
//             res.statusCode = 500;
//             res.send({error:error.message});
//         })
//     }else{
//         res.statusCode=400;
//         res.send({error:"Invalid class Object Id formate !!!"});
//     }
    
// }

exports.deleteById = async(req, res)=>{
     // console.log(req.query.id);
     if(ObjectId.isValid(req.query.id)){
        activityLogModel.deleteOne( {_id : req.query.id}, {__v : 0})
        .then((doc)=>{
            console.log(doc.deletedCount + " - activity deleted using ID");
           res.sendStatus(200);
        })
        .catch(error=>{
           console.log("error Occured deleting activity  with Id!!!");
           console.log(error.message);
           res.statusCode = 500;
           res.send({error:error.message});
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid activity Object Id formate"});
    }
     
}
exports.deleteAll = async(req,res)=>{
    if(req.params.secret === config_secret){
        activityLogModel.deleteMany().catch(err=>{
            console.log("Error occured on deletion of activity records !!!");
            res.sendStatus(500);
        }).then((docs)=>{
            // console.log(docs.deletedCount);
            console.log(docs.deletedCount + " activities deleted successfully !!!!");
            res.sendStatus(200);
        });
    }else{
        res.statusCode = 401;
        res.send({error : "You don't know the secret to delete all the activity document !!!"});
    }
    
}
