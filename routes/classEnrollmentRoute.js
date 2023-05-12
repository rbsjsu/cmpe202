var express = require("express");
const router = express.Router();
const controller = require("../controllers/classEnrollController");

router.get("/", controller.defaultFunction);
router.post("/enroll", controller.enrollClass);
router.delete("/unenroll", controller.deleteById); // query params - id

router.get("/get", controller.getById); // query parameter - id
router.get("/get/enrolled", controller.getEnrolledClasses); // query parameter - id
router.get("/get/unenrolled", controller.getUnEnrolledClasses);

router.get("/all", controller.getAll);
router.post("/stats", controller.getEnrollmentCount);


router.delete("/delete-all/:secret", controller.deleteAll);
router.delete("/delete", controller.deleteById);

module.exports= router;