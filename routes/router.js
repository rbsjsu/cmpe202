const express = require('express');
const sampleRoute = require("./sample");
const membershipRoute = require("./membershipRoute");
const userRoute = require("./userRoute");
const enrollmentRoute = require("./enrollmentRoute");
const gymRoute = require("./gymRoute");
const classRoute = require("./classRoute");
const classEnrollRoute = require("./classEnrollmentRoute");
const registryRoute = require("./registryRoute");

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
router.use("/class", classRoute);
router.use("/class-enroll", classEnrollRoute);
router.use("/registry", registryRoute);





module.exports = router;