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


exports.getEnrollmentCount= async(req, res)=>{
    const {start_time, end_time} = req.body;

    let data = [];
    let classData = [];

    try{
        data= await classEnrollmentModel.find({creation_time:{
            $gte : start_time ? start_time : "1990-12-12",
            $lte : end_time ? end_time : "2100-12-12"
        }});

        // console.log(data);

        classData = await classModel.find({start_time:{
            $gte : start_time ? start_time : "1990-12-12",
            $lte : end_time ? end_time : "2100-12-12"
        }});

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
                label: 'Number of Class Enrollment by day',
                data: byDaysCount(data),
                fill: false,
                borderColor: 'green',
                backgroundColor:"rgb(192, 75, 75)",
                tension: 0.1,
            },{
                label: 'Number of Class by day',
                data: byDaysCount(classData),
                fill: false,
                borderColor: 'green',
                backgroundColor:"rgb(75, 192, 192)",
                tension: 0.1,
            }]
        }
    fRes.dataByWeekDay = {
            labels:['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [{
                label: 'Number of Class Enrollment by the Week',
                data: byWeekCount(data),
                fill: false,
                borderColor: 'green',
                backgroundColor:"rgb(192, 75, 75)",
                tension: 0.1,
            },{
                label: 'Number of Class Enrollment by the Week',
                data: byWeekCount(classData),
                fill: false,
                borderColor: 'green',
                backgroundColor:"rgb(75, 192, 192)",
                tension: 0.1,
            }]
        };
         
      
    res.send(fRes);
}

function byDaysCount(data){
    let ans = [];
    for(let i=0; i<31; i++){
        ans[i]=0;
    }

    data.forEach(ele=>{
        let time = ele.start_time!=null?ele.start_time:ele.creation_time;
        let d = new Date(time);
        ans[d.getDate()-1]++;
    })

    return ans;
}

function byWeekCount(data){
    let ans = [0,0,0,0,0,0,0];
   
    
    data.forEach(ele=>{
        let time = ele.start_time!=null?ele.start_time:ele.creation_time;
        let d = new Date(time);
        ans[d.getDay()]++; 
    })

   
    return ans;
}

