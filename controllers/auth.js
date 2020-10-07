const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

exports.registration = async (req,res) => {
    const userExists = await User.findOne({email:req.body.email})
    console.log("User Exist",userExists);
    if (userExists)
        return res.status(403).json({
            error: "Email is taken!"
       })
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({message:"Registration success! Please login."});

}


exports.login = (req,res) => {
    const {email, password} = req.body;
   User.findOne({email},(err,user)=>{
   if(err || !user){
   return res.status(401).json({
       error:"User with that email does not exist.Please login."
   });
   }

   if(!user.authenticate(password)) {
       return res.status(401).json({
           error:"Email and password do not match."
       });
   }
   
   const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
   res.cookie("t",token,{expiry: new Date() + 9999});
   const {_id, name, email} = user;
   return res.json({token,user: {_id,name,email}});
   });
   }
   
   exports.logout = (req,res) => {
       res.clearCookie("t");
      return res.json({message:"Signout Success!"});
   };
   
   exports.allUsers = (req,res) => {
    User.find((err,users) => {
        if (err) {
            return res.status(400).json({
                error:err
            });
        }
        res.json(users);
    }).select("name email created");
};

exports.userById = (req,res,next,id) =>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User not found."
            });
        }
        req.profile = user; 
        next();
    });
};

exports.getUser = (req,res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};
  
  