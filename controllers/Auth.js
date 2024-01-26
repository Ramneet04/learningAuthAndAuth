const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req,res) =>{
    try {
        const {name,email,password,role}= req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message:"Email already in use",
            })
        }
        // Hash the password before saving it to database
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in hashing Password",
            })
        }
        const user= await User.create({
            name, email, password: hashedPassword,role
        })
        return res.status(200).json({
            success: true,
            data:user,
            message: "Sign Up Success"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error,
            message: "User cannot be registered, please try again later",
        })
    }
}

exports.login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({
                success: false,
                message: "Please all the details",
            })
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message:"Sign Up first",
            })
        }
        // payload means data.
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        }
        //verify password and generate JWT token
        if(await bcrypt.compare(password,user.password)){
            //we create token using sign method.
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"});

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            return res.cookie("RamneetCookie", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in Successfully"
            })
        }
        else{
            res.status(403).json({
                success: false,
                message: "Password is incorrect",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            error: error,
            message: "Login Failure"
        })
    }
}