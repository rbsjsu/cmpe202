var counter = 0;
const registryModel = require("../models/Registry");
const config_secret = require("../config.json").db.secret;
const ObjectId = require("mongoose").Types.ObjectId;

exports.defaultFunction=async(req,res)=>{
    console.log("request received, counter = " + counter);
    counter+=1;
    res.send({Registry :counter});
}

exports.getAll = async(req, res)=>{
    registryModel.find({}).then(doc=>{
        res.send({registry:doc});
    }).catch(e=>{
        console.log("Error occured while fetching all registry !!");
        e.printStack();
        res.send({error : e.message});
    });
}

exports.checkin = async(req,res)=>{
    let {user_id, gym_id} = req.body;
    const newRegistry = new registryModel({
        user_id,
        gym_id
    });

    let error = await newRegistry.validateSync();

    if(error){
        res.statusCode = 400;
        res.json(error.errors);
    }else{
        newRegistry.save().then(doc=>{
            res.statusCode =201;
            res.send({registry : newRegistry});
        }).catch((err)=>{
            console.log("Error Occured while saving the Registry !!!!");
            console.log(err);
            res.sendStatus(500);
        });
    }
}

exports.checkout = async(req,res)=>{
    let registry_id = req.body.id;
    registryModel.findOneAndUpdate({_id : registry_id}, {checkout_flag:true, checkout_time: new Date()}, {new : true})
    .then(doc=>{
        res.send({registry: doc});
    }).catch(e=>{
        console.log("Error Occured while checking out registry !");
        console.log(e);
        res.send({error: e.message});
    });
}

exports.getRegistryByGymIdAndFlag = async(req,res)=>{
    let filter ={ gym_id : req.query.gym_id}

    if(req.query.checkout_flag != null){
        filter.checkout_flag = req.query.checkout_flag;
    }

    // console.log(filter);
    registryModel.find(filter).then(doc=>{
        res.send({registry:doc});
    }).catch(e=>{
        console.log("Error occured while fetching registry using gym_id and checkout flag !");
        console.log(e);
        res.send({error: e.message});
    });
}


