const { default: mongoose } = require("mongoose");

const registry = new mongoose.Schema({
    user_id :{
        type : mongoose.Types.ObjectId,
        ref:"User",
        required: [true, "User id is missing !!!"]
    },
    gym_id : {
        type : mongoose.Types.ObjectId,
        ref : 'Gym',
        required : [true, "Gym Id is missing !!!"]
    },
    checkin_time : {
        type : Date,
        default : Date.now
        // required : true
    },
    checkout_time : {
        type : Date,
        default : '2099-12-31'
        // required : true
    },
    checkout_flag :{
        type : Boolean,
        default : false
    },
    creation_time : {
        type : Date, 
        default : Date.now 
    }
});

module.exports = mongoose.model("Registry", registry);
