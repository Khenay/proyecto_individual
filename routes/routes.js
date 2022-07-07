const router = require("express").Router();

const user = require("../controllers/user.controllers");


// router.get("/",user.home)
router.post("/login", user.login);
router.post("/register",user.register);
// router.get("/profile",user.profile);
// router.post("/login", user.login)
// router.get("/confirmuser/:id/:token", user.confirmUserGet);
// router.post("/confirmuser/:id/:token", user.checkUserPost);
// router.get("/datauser", user.dataUser);

module.exports = router;

