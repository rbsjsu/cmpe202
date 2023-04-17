var express = require("express");
const router = express.Router();
const sampleController = require("../controllers/sampleController");

router.get("/", sampleController.defaultFunction);
router.post("/add", sampleController.addData);
router.get("/all", sampleController.getAll)


module.exports= router;