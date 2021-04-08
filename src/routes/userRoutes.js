// imports
const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const Auth = require("../middlewares/Auth");

// use
router.post("/login", userCtrl.login);
router.post("/signup", userCtrl.signup);
router.get("/verify", userCtrl.verify);
router.put("/edit", userCtrl.edit);
router.get("/email-verification/:token", userCtrl.emailConfirm);
router.get("/resend-email", Auth, userCtrl.resendEmail);

// export
module.exports = router;