import Product from "../model/Product.js";
import asyncHandler from 'express-async-handler';
import User from "../model/User.js";

//@desc Register Product
//@route POST /api/products
//@access Private/Admin

export const createProduct = asyncHandler(
    
    async(req, res) => {
        const {name, description, brand, category, sizes, colors, fullname, images, reviews, price, totalQty, totalSold} = req.body

        //check if product exists
        const productExists = await Product.findOne({name});

        if (productExists) {
            throw new Error ('Product already exists')
        }

        //create product
        const product = await Product.create({name, description, brand, category, sizes, colors, user: req.userAuthId, images, reviews, price, totalQty, totalSold});

        //push the product into category
        
        //send the response

        res.status(201).json({
            status: 'success',
            message: 'Product registered successfully',
            data: product
        });

        

    }

    
);