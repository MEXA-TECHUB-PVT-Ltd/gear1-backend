const controller = require("../controllers/generateLinkController");
let router = require("express").Router();


router.get("/generate", controller.generate);


module.exports = router;