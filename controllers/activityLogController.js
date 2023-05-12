var counter = 0;
const activityLogModel = require('../models/ActivityLog');
const registryModel = require('../models/Registry');
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


exports.getByUserId = async(req, res)=>{
    const user_id = req.query.id;
    // const rData = [];
    let aData = [];
    try{
        // rData = await registryModel.find({ user_id});
        aData = await activityLogModel.find({ user_id});
    }catch(e){
        console.log("Error fetching the user Activity !");
        console.log(e);
        res.send(e.message);
    }

    // const data = [];
    // aData.forEach(activity => {
    //     data.push(activity);
    // });

    // rData.forEach(element =>{
    //     element.activity_type='registry';
    //     data.push(element);
    // })

    res.send(aData);

}

exports.getHourSpent = async(req, res)=>{

    const {start_time, end_time, user_id} = req.body;
    // console.log(user_id);
    let data = [];
    try{
         data= await activityLogModel.find({creation_time:{
            $gte : start_time ? start_time : "1990-12-12",
            $lte : end_time ? end_time : "2100-12-12"
        }, user_id});
    }catch(e){
        res.statusCode=500;
        res.send(e.message);
    }
   

    let hrLable = []
    for( let i=1; i<=31; i++){
        hrLable.push(i.toString());
    }
    const fRes={};
    fRes.dataByDay ={
        labels:hrLable,
        datasets: [{
                label: 'Number of visitors by the hour (by day)',
                data: byDaysCount(data),
                fill: false,
                borderColor: 'rgb(100,192,192)',
                backgroundColor:"rgb(75, 192, 192)",
                tension: 0.1,
            }]
    }
    fRes.dataByWeekday ={
        labels:['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [{
            label: 'Number of visitors by the Weekdays',
            data: byWeekDayCount(data),
            fill: false,
            borderColor: 'rgb(100,192,192)',
            backgroundColor:"rgb(75, 192, 192)",
            tension: 0.1,
        }]
    }
    fRes.dataByWeekend ={
        labels:['Saturday', 'Sunday'],
        datasets: [{
            label: 'Number of visitors by the Weekends',
            data: byWeekendCount(data),
            fill: false,
            borderColor: 'rgb(100,192,192)',
            backgroundColor:"rgb(75, 192, 192)",
            tension: 0.1,
        }]
    }
         
      
    res.send(fRes);
}

function byDaysCount(data){
    let ans = [];
    for(let i=0; i<31; i++){
        ans[i]=0;
    }

    data.forEach(ele=>{
        let d = new Date(ele.creation_time);
        ans[d.getDate()-1]+=ele.duration;
    })

    for(let i =0; i<31; i++){
        ans[i]/=60;
    }
    return ans;
}

function byWeekendCount(data){
    let ans = [0,0,0,0,0,0,0];
   

    data.forEach(ele=>{
        let d = new Date(ele.creation_time);
        ans[d.getDay()]+=ele.duration; 
    })

    for(let i =0; i<7; i++){
        ans[i]/=60;
    }
    let result = [];
    result[0]=ans[6];
    result[1]=ans[0];
    return result;
}
function byWeekDayCount(data){
    let ans = [0,0,0,0,0,0,0];
   

    data.forEach(ele=>{
        let d = new Date(ele.creation_time);
        ans[d.getDay()]+=ele.duration; 
    })

    for(let i =0; i<7; i++){
        ans[i]/=60;
    }
    return ans.slice(1,6);
}


