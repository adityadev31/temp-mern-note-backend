// imports
const router = require("express").Router();
const noteCtrl = require("../controllers/noteCtrl");
const Auth = require("../middlewares/Auth");

// use
router.get("/", Auth, noteCtrl.getAll);
router.get("/:id", Auth, noteCtrl.getOne);
router.post("/", Auth, noteCtrl.post);
router.put("/:id", Auth, noteCtrl.edit);
router.delete("/:id", Auth, noteCtrl.delete);

// export
module.exports = router;