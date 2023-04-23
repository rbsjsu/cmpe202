const { default: mongoose } = require("mongoose");

const user = new mongoose.Schema({
    name :{
        type : String,
        required: [true, "User name is missing !!!"]
    },
    address : {
        type : String,
        default : "This is a default Address for User !!!"
    },
    phone_no : {
        type : Number,
        default : 4086693243,
        // required : true
    },
    role : {
        type : String,
        enum : ['Employee', 'Instructor', 'Member'],
        default : "Member"
    },
    email_id : {
        type : String,
        required: [true, "Email Id missing "]
    },
    password : {
        type : String,
        default : "cmpe202"
    },
    creation_time : {
        type : Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("User", user);
