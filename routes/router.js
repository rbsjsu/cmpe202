const express = require('express');
const sampleRoute = require("./sample");
const membershipRoute = require("./membershipRoute");
const userRoute = require("./userRoute");
const enrollmentRoute = require("./enrollmentRoute");
const gymRoute = require("./gymRoute");


const router = express.Router();



router.get("/", (req,res)=>{
    console.log("default point !!!!");
    res.send("default point");
});

router.use("/sample", sampleRoute);
router.use("/membership/", membershipRoute);
router.use("/user/", userRoute);
router.use("/enrollment", enrollmentRoute);
router.use("/gym", gymRoute);





module.exports = router;