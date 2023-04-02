var express = require('express');
var sampleRoute = require("./sample");
const router = express.Router();



router.get("/", (req,res)=>{
    console.log("default point !!!!");
    res.send("default point");
});

router.use("/sample", sampleRoute);


module.exports = router;