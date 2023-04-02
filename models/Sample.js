const { default: mongoose } = require("mongoose");

var Sample = new mongoose.Schema({
    title :{
        type : String,
        default: "default Titile",
        required: [true, "Why no Title?"]
    },
    desc :{
        type : String,
        required: [true, "Why no Description?"]
    }
});

module.exports= mongoose.model("sample", Sample);