// authenthication , authorization for Student, authorization for Admin
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) =>{
    try {
        const token = req.body.token;
        if (!token) return res.status(401).json({
            success: false,
            message: "No Token Provided",
        });

        //verify token
        try {
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success:false,
                error:"Invalid Token"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Something went wrong while verifying the token",
        })
    }
}

exports.isStudent = (req,res,next) =>{
    try {
        if(req.user.role!="Student"){
            return res.status(401).json({
                success:false,
                message:"Unauthorized Access - You are not a student."
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "User role is not matching",
        })
    }
}

exports.isAdmin = (req,res,next) =>{
    try {
        if(req.user.role!="Admin"){
            return res.status(401).json({
                success:false,
                message:"Unauthorized Access - You are not a Admin."
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "User role is not matching",
        })
    }
}