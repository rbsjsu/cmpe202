var express = require("express");
const router = express.Router();
const controller = require("../controllers/activityLogController");

router.get("/", controller.defaultFunction);
router.post("/create", controller.logActivity);
router.delete("/delete", controller.deleteById); // query params - id

router.get("/get", controller.getById); // query parameter - id
router.get("/all", controller.getAll);
router.get("/user", controller.getByUserId);
router.post("/hour-spend", controller.getHourSpent);

router.delete("/delete-all/:secret", controller.deleteAll);

module.exports= router;