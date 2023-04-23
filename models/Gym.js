const { default: mongoose } = require("mongoose");

const gym = new mongoose.Schema({
    location :{
       type : String,
       required : [true, " Gym Location is missing !!!" ]
    },
    description : {
        type : String,
        default : "Gym Description !!!"
    },
    creation_time : {
        type : Date, 
        default : Date.now 
    }
});

module.exports = mongoose.model("Gym", gym);
