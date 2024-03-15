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
        console.log(req.body);
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
         if (req.query.color) {
            console.log(req.query.size);
            productQuery = productQuery.find({
                colors: {$regex: req.query.color, $options:'i'}
            })
        }
         //search by size
         if (req.query.size) {
            productQuery = productQuery.find({
                sizes: {$regex: req.query.size, $options:'i'}
            })
        }

         //search by price range
         if (req.query.price) {

            let priceRange = req.query.price.split('-');

            //how to: in this case we need to use some mongodb operators inside the find query

            //gte: greater than or equal to
            //lte: less than or equal to

            productQuery.find({
                price:{$gte:priceRange[0], $lte:priceRange[1]}
            })

        }

        //pagination

        //page
        const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        
        //limit
        const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

        //startIdx
        const startIndex = (page-1)*limit;

        //endIdx
        const endIndex = page * limit;

        //total
        const total = await Product.countDocuments();

        productQuery = productQuery.skip(startIndex).limit(limit);

        //pagination results
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page -1,
                limit
            }
            
        }

        //await the query
        const products = await productQuery;

        
       
        res.json(
            {
            status: 'success',
            total,
            results: products.length,
            pagination,
            data: products,
            }
        )


    }

);

//@desc Fetch a single product
//@route GET /api/products/:id
//@access Public
export const getProductCtrl = asyncHandler(

        async(req, res) => {

            const productId = req.params.id

            const product = await Product.findById(productId);

            if (!product) {
                throw new Error ('No product found');
            }

            res.json({
                status: 'Success',
                data: product
            })

        }

);








