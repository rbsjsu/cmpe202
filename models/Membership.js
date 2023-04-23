const { default: mongoose } = require("mongoose");

const membership = new mongoose.Schema({
    name :{
        type : String,
        required: [true, "Membership name not found !!!"]
    },
    description : {
        type : String,
        default : "This is a default Membership decription !!!"
    },
    price : {
        type : Number,
        default : 50,
        // required : true
    },
    duration : {
        type : Number,
        default : 30
    },
    creation_time : {
        type : Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Membership", membership);
