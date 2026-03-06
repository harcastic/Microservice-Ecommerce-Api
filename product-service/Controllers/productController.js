import Product from "../Models/productModel.js";
import { getChannel } from "../utils/connectRabbit.js";

const createProduct = async (req, res) =>{
    try {
        const {name, description, price} = req.body;
        const newProduct = await Product.create({
            name ,
            description,
            price
        });
        return  res.status(200).json({
            message : "Product listed successfully",
            newProduct
        }) 
    } 
    catch (error) {
        res.status(500).json({
            message : "product listing failed"
        })
    }
}
export default createProduct;

export const buyProduct = async (req, res) => {
    try {
        const channel = getChannel();
        const { id } = req.body;

        if (!channel) {
            return res.status(500).json({
                message: "RabbitMQ not initialized"
            });
        }

        if (!id || (Array.isArray(id) && id.length === 0)) {
            return res.status(400).json({
                message: "Product IDs are required"
            });
        }

        const products = await Product.find({
            _id: { $in: id }
        });

        if (products.length === 0) {
            return res.status(404).json({
                message: "Products not found"
            });
        }

        // Send order request to order service
        channel.sendToQueue(
            "ORDER",
            Buffer.from(JSON.stringify({
                products,
                userEmail: req.user.email
            }))
        );

        // Return immediately - order will be processed asynchronously
        res.status(200).json({ 
            message: "Order request sent successfully",
            products 
        });
    } catch (error) {
        console.error("Error in buyProduct:", error);
        res.status(500).json({
            message: "Failed to process order",
            error: error.message
        });
    }
};