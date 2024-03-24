import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(
    async(req,res) => {
        //Get payload (user, orderItems, shippingAddress, totalPrice)
        const {orderItems, shippingAddress, totalPrice, status} = req.body;

        console.log(orderItems);
        
        //find the user
        const user = await User.findById(req.userAuthId);

        //check if user has shipping address
        if (!user?.hasShippingAddress) {
            throw new Error ("Provide address")   
        }

        //check if order is not empty
        if (orderItems?.length <= 0) {
            throw new Error('No order items');
        }

        //prace the order - save into db
        const order = await Order.create({
            user:req.userAuthId,
            orderItems,
            shippingAddress,
            totalPrice,
            status
        });

        //push order into user
        user.orders.push(order?._id);
        await user.save();

        //update the product qty and qty sold
        const products = await Product.find({_id:{$in:orderItems}});

        orderItems?.map(async(order)=> {
            const product = products?.find((product)=> {
                return product?._id?.toString() === order?._id?.toString()
            });
            
            if (product) {
                product.totalSold += order.quantity
            }
            await product.save()
        });

        //make payment (stripe)
        //convert ordem items to have same data structure from Stripe;
        const convertedOrders = orderItems?.map((item)=>{
            return {
                price_data:{
                    currency: 'brl',
                    product_data:{
                        name:item?.name,
                        description:item?.description,
                    },
                    unit_amount: item?.price *100
                },
                quantity:item?.quantity
                }
        });
        
        const session = await stripe.checkout.sessions.create({
            line_items:convertedOrders,
            mode:'payment',
            success_url: 'http://localhost:7000/success',
            cancel_url: 'http://localhost:7000/cancel',
        });

        res.send({url: session.url});

        //payment webhook
        //update the user order
        
        // res.json({
        //     success:true,
        //     message: 'Order controller',
        //     order,
        //     user

        // })
    }
);
