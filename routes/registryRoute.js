var express = require("express");
const router = express.Router();
const controller = require("../controllers/registryController");

router.get("/", controller.defaultFunction);
router.get("/all", controller.getAll);
router.get("/gym", controller.getRegistryByGymIdAndFlag); // query parameter - gym_id , checkout_flag(optional)
router.post("/checkout", controller.checkout);
router.post("/checkin", controller.checkin);

// router.delete("/unenroll", controller.deleteById); // query params - id

// router.get("/get", controller.getById); // query parameter - id
// router.get("/all", controller.getAll);


// router.delete("/delete-all/:secret", controller.deleteAll);

module.exports= router;