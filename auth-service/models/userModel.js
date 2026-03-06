import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true, 
    },
    password : {
        type : String,
        required : true,
    },
    created_At : {
        type : Date,
        default : Date.now
    }
})

const User = mongoose.model("User", userSchema);
export default User;