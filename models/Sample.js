const { default: mongoose } = require("mongoose");

var Sample = new mongoose.Schema({
    title :{
        type : String,
        default: "default Titile"
    },
    desc :{
        type : String
    }
});

module.exports= mongoose.model("sample", Sample);