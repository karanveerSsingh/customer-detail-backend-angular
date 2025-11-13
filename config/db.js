const mongoose = require('mongoose');

const connectDataBase = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DataBase Connect Successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

module.exports = connectDataBase;