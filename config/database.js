const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("db connection successful");
    })
    .catch((err)=>{
        console.log("ERROR IN DB CONNECTION :",err.message);
        //Abnormal termination...
        process.exit(1);
    });
}
module.exports=dbConnect;