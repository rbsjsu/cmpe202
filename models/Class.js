const { default: mongoose } = require("mongoose");

const gym_class = new mongoose.Schema({
    instructor_id :{
        type : mongoose.Types.ObjectId,
        ref:"User",
        required: [true, "instructor id is missing !!!"]
    },
    gym_id : {
        type : mongoose.Types.ObjectId,
        ref : 'Gym',
        required : [true, "Gym Id is missing !!!"]
    },
    name : {
        type : String,
        required : [true, "Class name is required !"]
    },
    description: {
        type : String,
        default : "Default class description !"
    },
    start_time : {
        type : Date,
        required:[true, "Class Start time missing !"],
        // default : '2099-12-31'
        // required : true
    },
    end_time :{
        type : Date,
        required: [true, "End Time missing !"]
    },
    creation_time : {
        type : Date, 
        default : Date.now 
    }
});

module.exports = mongoose.model("Class", gym_class);
