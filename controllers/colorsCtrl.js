import Colors from "../model/Colors.js";
import asyncHandler from "express-async-handler";


//@desc Create a new color
//@route POST /api/colors
//@access Private/Admin
export const createColorCtrl = asyncHandler(
    async(req,res) => {
        const {name, user } = req.body;

        const colorFound = Colors.findOne({name:name});

        if (!colorFound) {
            throw new Error ('No color with this name found');
        }

        const color = await Colors.create({name: name, user: req.userAuthId});

        res.json({
            message: 'Color created',
            data: color
        })


    }
);

//@desc get all colors
//@route GET /api/colors
//@access Public
export const getAllColorsCtrl = asyncHandler(
    async(req, res) => {

        const colors = await Colors.find();

        res.json({
            message: 'Colors found',
            data: colors
        })
    }
);

//@desc get a single color
//@route GET /api/colors/:id
//@access Public
export const getColorCtrl = asyncHandler(

    async(req, res) => {

    const colorID = req.params.id 

    const color = await Colors.findById(colorID);

    if (!color) {
        throw new Error ('No color found');
    }

    res.json({
        message: 'Color found',
        data: color
    })

    }
);

//@desc update a single color
//@route PUT /api/colors/:id
//@access Private
export const updateColorCtrl = asyncHandler(
    async(req, res) => {
        const colorID = req.params.id;
        const {name} = req.body;

        const colorFound = await Colors.findById(colorID);

        if (!colorFound) {
            throw new Error ('No color found')
        }

        const color = await Colors.findByIdAndUpdate(colorID, {name: name }, {new: true});
        
        res.json({
            message: 'Color updated',
            data: color
        })

    }
);

//@desc update a single color
//@route DELETE /api/colors/:id
//@access Private

export const deleteColorCtrl = asyncHandler(
    async(req, res) => {
        const colorID = req.params.id;

        const color  = await Colors.findById(colorID);

        if (!color) {
            throw new Error('No color founded');
        }

        await Colors.findByIdAndDelete(colorID);

        res.json({
            message: 'Color deleted',
            data: null
        })
    }
);


