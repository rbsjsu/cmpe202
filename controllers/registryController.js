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

exports.checkinActivityByUserId= async(req, res)=>{
    let body = req.body;
    let end_time =  body.end_time ? body.end_time : new Date();
    let start_time = body.start_time ? body.start_time : new Date("1900-12-12");

    // console.log(end_time);
    registryModel.find(
        {   
            user_id : body.user_id, 
            checkin_time :{$gte : start_time},
            checkout_time:{$lte : end_time}
        }
    ).populate('gym_id')
    .then(data=>{
        res.send(data);
    }).catch(e=>{
        console.log("Error fetching the user checkin Activity !");
        console.log(e);
        res.send(e.message);
    })
}

exports.getRegistryByGymIdAndFlag = async(req,res)=>{
    let filter ={ }

    if(req.body.gym_id){
        filter.gym_id = req.body.gym_id
    }
    if(req.body.checkout_flag != null){
        filter.checkout_flag = req.body.checkout_flag;
    }

    // console.log(filter);
    registryModel.find(filter).populate('user_id').populate('gym_id').then(doc=>{
        res.send(doc);
    }).catch(e=>{
        console.log("Error occured while fetching registry using gym_id and checkout flag !");
        console.log(e);
        res.send({error: e.message});
    });
}

exports.getCheckouts = async(req,res)=>{
    // let filter ={ gym_id : req.body.gym_id}

    // if(req.body.checkout_flag != null){
    //     filter.checkout_flag = req.body.checkout_flag;
    // }

    // console.log(filter);
    registryModel.find({checkout_flag:false}).populate('user_id').populate('gym_id').then(doc=>{
        res.send(doc);
    }).catch(e=>{
        console.log("Error occured while fetching registry using gym_id and checkout flag !");
        console.log(e);
        res.send({error: e.message});
    });
}

exports.getVisitorsCount = async(req, res)=>{

    const {start_time, end_time, gym_id} = req.body;

    let data = [];
    try{
         data= await registryModel.find({checkin_time:{
            $gte : start_time ? start_time : "1990-12-12",
            $lte : end_time ? end_time : "2100-12-12"
        }, gym_id:gym_id?gym_id:"6447f04bc992896e943c63d9"});
    }catch(e){
        res.statusCode=500;
        res.send(e.message);
    }
   

    let hrLable = []
    for( let i=0; i<24; i++){
        hrLable.push(i.toString());
    }
    const fRes={};
    fRes.dataByDay ={
        labels:hrLable,
        datasets: [{
                label: 'Number of visitors by the hour (by day)',
                data: byDaysCount(data),
                fill: false,
                borderColor: 'green',
                backgroundColor:"rgb(75, 192, 192)",
                tension: 0.5,
            }]
    }
    fRes.dataByWeekday ={
        labels:['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [{
            label: 'Number of visitors by the Weekdays',
            data: byWeekDayCount(data),
            fill: false,
            borderColor: 'green',
            backgroundColor:"rgb(75, 192, 192)",
            tension: 0.5,
        }]
    }
    fRes.dataByWeekend ={
        labels:['Saturday', 'Sunday'],
        datasets: [{
            label: 'Number of visitors by the Weekends',
            data: byWeekendCount(data),
            fill: false,
            borderColor: 'green',
            backgroundColor:"rgb(75, 192, 192)",
            tension: 0.1,
        }]
    }
         
      
    res.send(fRes);
}

function byDaysCount(data){
    let ans = [];
    for(let i=0; i<25; i++){
        ans[i]=0;
    }

    data.forEach(ele=>{
        let d = new Date(ele.checkin_time);
        ans[d.getHours()]++;
    })

    return ans;
}

function byWeekendCount(data){
    let ans = [0,0,0,0,0,0,0];
   

    data.forEach(ele=>{
        let d = new Date(ele.checkin_time);
        ans[d.getDay()]++; 
    })

    let result = [];
    result[0]=ans[6];
    result[1]=ans[0];
    return result;
}
function byWeekDayCount(data){
    let ans = [0,0,0,0,0,0,0];
   

    data.forEach(ele=>{
        let d = new Date(ele.checkin_time);
        ans[d.getDay()]++; 
    })

    
    return ans.slice(1,6);
}





