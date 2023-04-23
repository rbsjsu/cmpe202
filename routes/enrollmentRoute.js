var express = require("express");
const router = express.Router();
const controller = require("../controllers/enrollmentController");

router.get("/", controller.defaultFunction);
router.get("/all", controller.getAll);
router.get("/get", controller.getById); // query parameter - id

router.post("/create", controller.addEnrollment);

router.delete("/delete-all/:secret", controller.deleteAll);
router.delete("/delete", controller.deleteById); // query params - id

router.put("/update", controller.update) 
module.exports= router;