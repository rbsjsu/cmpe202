const express = require('express');
const sampleRoute = require("./sample");
const membershipRoute = require("./membershipRoute");
const userRoute = require("./userRoute");
const router = express.Router();



router.get("/", (req,res)=>{
    console.log("default point !!!!");
    res.send("default point");
});

router.use("/sample", sampleRoute);
router.use("/membership/", membershipRoute);
router.use("/user/", userRoute);




module.exports = router;