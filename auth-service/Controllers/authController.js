import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";
import User from '../models/userModel.js';

const register = async ( req, res ) => {
    try {
        const  { username , email, password} = req.body;
        const existingUser = await User.findOne({email});

        const hassedPwd = await bcrypt.hash(password, 10);
        
        if(existingUser){
            return res.status(403).json({
                message : "User already exists"
            })
        }
        const user = await User.create({
            username, 
            email ,
            password : hassedPwd,
        });
    
        return res.status(201).json({
            message : "User registerd successfully",
            user,
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
};
export default register;

export const login = async (req , res) => {
    try {
        const {username, password} = req.body;
    
        const user = await User.findOne({username});
    
        if(!user){
            return res.status(400).json({
                message: "User not registered"
            });
        }
    
        const Matched = await bcrypt.compare(password, user.password);
        if(!Matched){
            return res.status(400).json({
                message : "Invalid Credentials"
            });
        }
    
        const token = jwt.sign({ id : user._id },
            process.env.SECRET_KEY,
            {expiresIn : "1h"}
        );
    
        return res.status(200).json({token});
    } 
    catch (error) {
        return res.status(500).json({
            message : "Login failed"
        });    
    }
}
