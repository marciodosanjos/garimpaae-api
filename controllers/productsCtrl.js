import Product from "../model/Product.js";
import asyncHandler from 'express-async-handler';

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

//@desc Fetch all products
//@route GET /api/products
//@access Public

export const getProductsCtrl = asyncHandler(

    async(req, res) => {
        console.log(req.query);
        //query
        let productQuery = Product.find();

        //search by name
        if (req.query.name) {
            productQuery = productQuery.find({
                name: {$regex: req.query.name, $options:'i'}
            })
        }

         //search by brand
         if (req.query.brand) {
            productQuery = productQuery.find({
                brand: {$regex: req.query.brand, $options:'i'}
            })
        }

         //search by category
         if (req.query.category) {
            productQuery = productQuery.find({
                category: {$regex: req.query.category, $options:'i'}
            })
        }

         //search by color
         if (req.query.colors) {
            productQuery = productQuery.find({
                colors: {$regex: req.query.color, $options:'i'}
            })
        }
         //search by size
         if (req.query.size) {
            productQuery = productQuery.find({
                size: {$regex: req.query.size, $options:'i'}
            })
        }

        //await the query
        const products = await productQuery;
       
        res.json(
            {
            status: 'success',
            data: products
            }
        )


    }

);


