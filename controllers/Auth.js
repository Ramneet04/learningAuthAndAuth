const bcrypt = require("bcrypt");
const User = require("../models/User")

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