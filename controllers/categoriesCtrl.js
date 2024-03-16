import Category from "../model/Categories.js";
import asyncHandler from 'express-async-handler';

//@desc Create a new category
//@route POST /api/category
//@access Private/Admin

export const createCategoryCtrl = asyncHandler(

    async(req, res) => {

        const {name, user, image, products} = req.body;

        //check if it already exists
        const categoryFound = await Category.findOne({name});
        if (categoryFound) {
            throw new Error ('Category already exists');
        }

        //create
        const category = await Category.create({name, user: req.userAuthId});
        res.json({
            message: 'Category created, successfully',
            data: category
        });


    }
);