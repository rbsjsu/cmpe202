const { default: mongoose } = require("mongoose");

const enrollment = new mongoose.Schema({
    user_id :{
        type : mongoose.Types.ObjectId,
        ref:"User",
        required: [true, "User id is missing !!!"]
    },
    membership_id : {
        type : mongoose.Types.ObjectId,
        ref : 'Membership',
        required : [true, "Membership Id is missing !!!"]
    },
    expiration_time : {
        type : Date,
        default : '2099-12-31'
        // required : true
    },
    creation_time : {
        type : Date, 
        default : Date.now 
    }
});

module.exports = mongoose.model("Enrollment", enrollment);
