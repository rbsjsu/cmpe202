const { default: mongoose } = require("mongoose");

const log_activity = new mongoose.Schema({
    user_id :{
        type : mongoose.Types.ObjectId,
        ref : "User",
        required: [true, "User Id not found !!!"]
    },
   activity_type : {
        type : String,
        enum : ['Treadmill', 'Cycling', 'Weight Training', 'Stairs', 'Cardio'],
        default : "Treadmill" 
   },
    duration : {
        type : Number,
        default : 20
    },
    creation_time : {
        type : Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("ActivityLog", log_activity);
