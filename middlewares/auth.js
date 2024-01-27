// authenthication , authorization for Student, authorization for Admin
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) =>{
    try {
        // Bearer ramneet  lets say isis the token we have relace Bearer  by "" so only token or ramneet is left its just the example...
        //real token is like zvvzgcghhajklajhaha okkk
        console.log("cookies -> ", req.cookies.rememberme);
        const token = req.cookies.rememberme;
        console.log(token)
        if (!token){
            return res.status(401).json({
                success: false,
                message: "No Token Provided",
            });
        }

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
            error,
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