const { default: mongoose } = require("mongoose");

const classEnrollment = new mongoose.Schema({
    user_id :{
        type : mongoose.Types.ObjectId,
        ref:"User",
        required: [true, "User id is missing !!!"]
    },
    class_id : {
        type : mongoose.Types.ObjectId,
        ref : 'Class',
        required : [true, "Membership Id is missing !!!"]
    },
    creation_time : {
        type : Date, 
        default : Date.now 
    }
});

module.exports = mongoose.model("ClassEnrollment", classEnrollment);
