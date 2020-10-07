const express = require("express");
const {registration,login,logout,userById,allUsers,getUser} = require("../controllers/auth");
const router = express.Router();


router.post("/registration", registration);
router.post("/login", login);
router.get("/logout", logout);
router.get ("/users", allUsers);
router.get ("/user/:userId", getUser);
router.param ("userId", userById);
module.exports = router;