const express= require("express");
const router = express.Router();
const User = require("../models/User")
const {login, signup} = require("../controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth");

router.post("/login",login);
router.post("/signup",signup);

//Protected Routes
router.get("/test", auth, (req,res)=>{
    res.json({
        success: true,
        messgae:"Welcome to Protected route for Test",
    });
});

router.get("/student", auth, isStudent, (req,res)=>{
    res.json({
        success: true,
        messgae:"Welcome to Protected route for Students",
    });
});

router.get("/admin", auth, isAdmin, (req,res)=>{
    res.json({
        success: true,
        messgae:"Welcome to Protected route for Admin",
    });
});

router.get("/getdata", auth, async (req,res)=>{
    try {
        const id = req.user.id;
        const user = await User.findOne({_id:id});
        res.json({
            success: true,
            data : user,
        })   
    } catch (error) {
        res.json({
            success: false,
            error: error,
        })
    }
});


module.exports = router;