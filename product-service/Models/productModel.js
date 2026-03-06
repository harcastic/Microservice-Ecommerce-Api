import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required: true
    },
    price : {
        type : Number,
        required: true
    },
    created_At : {
        type : Date,
        default : Date.now()
    }
});

const Product = mongoose.model("Product" , productSchema);

export default Product;