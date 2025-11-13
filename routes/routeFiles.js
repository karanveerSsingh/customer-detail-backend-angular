const express = require("express");
const router = express.Router();
const userController = require('../controllers/loginUser');


router.post("/loginUser",userController.loginUser); // http://localhost:3000/api/customers/loginUser
router.post("/registerUser",userController.registerUser); // http://localhost:3000/api/customers/registerUser


module.exports = router;