import Product from "../model/Product.js";
import Review from "../model/Review.js";
import asyncHandler from "express-async-handler";


export const createReviewCtrl = asyncHandler(
    async(req,res) => {
        const {
            product,
            message,
            rating
        } = req.body

        //1. find the product to review
        const {id} = req.params;
        const productFound = await Product.findById(id).populate('reviews');

        // if there is no product
        if (!productFound) {
            throw new Error('Product not found');
        }

        //check if user already reviewed this product
        const hasReviewed = productFound.reviews.find((review)=>{
            return review?.user?.toString()  === req?.userAuthId?.toString()
        });

        if (hasReviewed) {
            throw new Error('You have reviewed this product');
        }

        //create review
        const review = await Review.create({
            user: req.userAuthId,
            product:productFound?._id,
            message: message,
            rating:rating

        });

        //push the review in products.reviews array
        productFound.reviews.push(review?._id);

        //resave
        await productFound.save();

        res.json({
            success: true,
            message: 'Review added',
            data: review
        })
    }
);
