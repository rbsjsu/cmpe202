var counter = 0;
const sampleModel = require('../models/Sample');

exports.defaultFunction=(req,res)=>{
    console.log("request received, counter = " + counter);
    counter+=1;
    res.send({counter});
}

exports.getAll = async(req,res)=>{
    var data = await sampleModel.find();
    // console.log(data);
    res.json(data);
    // res.send(200);
}

exports.addData = async(req,res)=>{

    console.log("***************");
    console.log(req.body);
    const newEntry = new sampleModel({
        title: req.body.title,
        desc: req.body.description
    });

    // var error = newEntry.validateSync();
    // console.log(error);
    await newEntry.save().then((doc)=>{
        console.log("Data Inserted : " + doc);
    }).catch((err)=>{
        console.log("Error Occured while saving the document !!!!");
        console.log(err);
    });
    console.log({newEntry});
    newEntry.title="changed the title";
    await newEntry.save().then((doc)=>{
        if(doc===newEntry){
            console.log("doc updated successfully!!!");
        }else{
            console.log("doc not updated !!!");
        }
    });

    console.log({"updated" : newEntry});

    res.send({ "data":newEntry});

}

