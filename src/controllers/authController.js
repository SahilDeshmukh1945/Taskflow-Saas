const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async(req,res)=>{
    try{
        const{name,email,password} = req.body;

        //check if user exist already
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User alreay exist"})
        } 
        //create new user
        const user = await User.create({
            name,
            email,
            password
        });
        return res.status(200).json({message : "User registered Succesfully", user: {
        _id: user._id,
        name: user.name,
        email: user.email
    }})
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};


// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
         // generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,   // later we will move to .env
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
          token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports= {registerUser,loginUser};