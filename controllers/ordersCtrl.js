import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";


// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);



export const createOrderCtrl = asyncHandler(
    async(req,res) => {
        //Get payload (user, orderItems, shippingAddress, totalPrice)
        const {orderItems, shippingAdress, totalPrice} = req.body;
        
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
            shippingAdress,
            totalPrice
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
        const session = await stripe.checkout.sessions.create({
            line_items:[{
                price_data:{
                    currency: "brl",
                    product_data:{
                        name:'Hats',
                        description: 'First hat',

                    },
                    unit_amount:10 * 100

                },
                quantity: 2,
            }],
            mode:'payment',
            success_url: 'htpp:/localhost:7000/success',
            cancel_url: 'htpp:/localhost:7000/cancel',
        });

        res.send({url: success.url})

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
