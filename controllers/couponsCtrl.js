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
            code: code,
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

