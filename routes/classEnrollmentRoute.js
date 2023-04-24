var express = require("express");
const router = express.Router();
const controller = require("../controllers/classEnrollController");

router.get("/", controller.defaultFunction);
router.post("/enroll", controller.enrollClass);
router.delete("/unenroll", controller.deleteById); // query params - id

router.get("/get", controller.getById); // query parameter - id
router.get("/all", controller.getAll);


router.delete("/delete-all/:secret", controller.deleteAll);

module.exports= router;