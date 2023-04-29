var express = require("express");
const router = express.Router();
const controller = require("../controllers/activityLogController");

router.get("/", controller.defaultFunction);
router.post("/creat", controller.logActivity);
router.delete("/delete", controller.deleteById); // query params - id

router.get("/get", controller.getById); // query parameter - id
router.get("/all", controller.getAll);

router.delete("/delete-all/:secret", controller.deleteAll);

module.exports= router;