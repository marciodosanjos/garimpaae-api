import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

//@desc create coupon
//@route POST /api/v1/coupons
//@access Private/Admin
export const createCouponCtrl = asyncHandler(
    async(req,res) =>{

        const {code, startDate, endDate, discount} = req.body;
        
        // check if admin

        const foundCoupon = await Coupon.findOne({code: code});

        if (foundCoupon) {
            throw new Error ('Coupon already exists');
        }

        if (isNaN(discount)) {
            throw new Error ('Discount value must be a number');
        }

        //create cupon
        const coupon = await Coupon.create({
            code: code?.toUpperCase(),
            startDate: startDate,
            endDate: endDate,
            discount: discount,
            user: req.userAuthId
        });

        res.json({
            status: 'success',
            message: 'Coupon created',
            data: coupon
        })

    }
);


//@desc fetch all coupons
//@route POST /api/v1/coupons
//@access Private/Admin
export const getCouponsCtrl = asyncHandler(
    async(req,res)=> {

        const coupons = await Coupon.find();

        res.json({
            status: 'Success',
            message: 'Coupons',
            data: coupons
        })
    }
);


//@desc fetch a single coupon
//@route POST /api/v1/coupons/:id
//@access Private/Admin

export const getCouponCtrl = asyncHandler(
    async(req,res)=> {
        const couponId = req.params.id;
        const coupon = await Coupon.findById(couponId);
    
        if (!coupon) {
            throw new Error ('No coupon found');
        }

        res.json({
            status:'success',
            message:'Coupon found',
            data: coupon
        })
    }
);


//@desc update a single coupon
//@route PUT /api/v1/coupons/:id
//@access Private/Admin
export const updateCouponCtrl = asyncHandler(
    async(req, res)=> {
        const {code, startDate, endDate, discount} = req.body;
        const couponId = req.params.id;
        const couponFound = await Coupon.findById(couponId);

        if (!couponFound) {
            throw new Error('No coupon found')
        }

        const coupon = await Coupon.findByIdAndUpdate(couponId, {code: code?.toUpperCase(), startDate, endDate, discount}, {new: true});

        res.json({
            success: 'true',
            message: 'Coupon updated',
            data: coupon
        })


    }
);

//@desc delete a single coupon
//@route DELETE /api/v1/coupons/:id
//@access Private/Admin

export const deleteCouponCtrl = asyncHandler(
    async(req, res)=> {
        const couponId = req.params.id;

        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            throw new Error ('No coupon found');
        }

       await Coupon.findByIdAndDelete(couponId);

        res.json({
            success: 'true',
            message: 'Coupon deleted',
        });
    }
);