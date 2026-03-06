import mongoose, { Schema } from "mongoose";

const orderSchema = mongoose.Schema({
    products : [ 
        {
            _id : {type : String},
            name : {type : String},
            description : {type : String},
            price : {type : Number}
        }
    ],
    user : {
        type : String,
    },
    totalPrice : {
        type : Number,
    },
    created_At : {
        type : Date,
        default : Date.now()
    }
})

const Order = mongoose.model("Order", orderSchema);
export default Order;