const mongoose = require('mongoose');

const userLoginSchema = new mongoose.Schema({
    userName: {type:String, required:true},
    userEmail:{type:String, required:true, unique:true},
    userPassword:{type:String, required:true}
})

const UserLogin = mongoose.model('UserLogin', userLoginSchema);
module.exports = UserLogin;