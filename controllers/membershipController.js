var counter = 0;
const membershipModel = require('../models/Membership');
const config_secret = require("../config.json").db.secret;
const ObjectId = require("mongoose").Types.ObjectId;

exports.defaultFunction=async(req,res)=>{
    console.log("request received, counter = " + counter);
    counter+=1;
    res.send({Membership:counter});
}

exports.addMembership = async(req, res)=>{
    const data = req.body;
    const newMembership = new membershipModel({
        name : data.name,
        description : data.description ? data.description : null,
        price : data.price,
        duration : data.duration
    });    

    let error = await newMembership.validateSync();
   if(error){
    res.statusCode = 400;
    res.json(error.errors);
   }else{
    newMembership.save().then((doc)=>{
        // console.log("Data Inserted : " + doc);
        res.statusCode =201;
        res.send({membership : newMembership});
    }).catch((err)=>{
        console.log("Error Occured while saving the document !!!!");
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
        membershipModel.findById( req.query.id, {__v : 0})
        .then((doc)=>{
        //    console.log("membership found");
           res.send({membership:doc});
        })
        .catch(error=>{
           console.log("error Occured fetching membership  with Id!!!");
           console.log(error.message);
           res.sendStatus(500);
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid Membership Object Id formate"});
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
    var data =  await membershipModel.find({},{"__v": 0});
    // console.log(data);
    res.json(data);
    // res.send(200);
}

exports.update = async(req, res)=>{
    let data = req.body;
    if(ObjectId.isValid(data.id)){
        membershipModel.findOneAndUpdate({_id:data.id}, {
            name : data.name,
            description : data.description ? data.description : null,
            price : data.price,
            duration : data.duration
        }, {new : true}).then((doc)=>{
            //console.log("=========")
            //console.log(doc);

            if(doc){
                res.send({membership : doc});
            }else{
                res.statusCode = 404;
                res.send({error : "Membership not find for the given Id"});
            }
            
        }).catch(error=>{
            console.log("error Occured while updating the membership !!!");
            console.log(error.message);
            res.statusCode = 500;
            res.send({error:error.message});
        })
    }else{
        res.statusCode=400;
        res.send({error:"Invalid Membership Object Id formate !!!"});
    }
    
}

exports.deleteById = async(req, res)=>{
     // console.log(req.query.id);
     if(ObjectId.isValid(req.query.id)){
        membershipModel.deleteOne( {_id : req.query.id}, {__v : 0})
        .then((doc)=>{
            console.log(doc.deletedCount + " - membership deleted using ID");
           res.sendStatus(200);
        })
        .catch(error=>{
           console.log("error Occured deleting membership  with Id!!!");
           console.log(error.message);
           res.statusCode = 500;
           res.send({error:error.message});
        });
    }else{
        res.statusCode=400;
        res.send({error:"Invalid Membership Object Id formate"});
    }
     
}
exports.deleteAll = async(req,res)=>{
    if(req.params.secret === config_secret){
        membershipModel.deleteMany().catch(err=>{
            console.log("Error occured on deletion of membership records !!!");
            res.sendStatus(500);
        }).then((docs)=>{
            // console.log(docs.deletedCount);
            console.log(docs.deletedCount + " memberships deleted successfully !!!!");
            res.sendStatus(200);
        });
    }else{
        res.statusCode = 401;
        res.send({error : "You don't know the secret to delete all the membership document !!!"});
    }
    
}
