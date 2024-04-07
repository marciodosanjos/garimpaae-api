import express from "express";
import { createCouponCtrl, deleteCouponCtrl, getCouponCtrl, getCouponsCtrl, updateCouponCtrl } from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const couponRouter = express.Router();

//routes for coupons
couponRouter.post('/', isLoggedIn, createCouponCtrl);
couponRouter.get('/', isLoggedIn, getCouponsCtrl);
couponRouter.get('/:id', isLoggedIn, getCouponCtrl);
couponRouter.put('/:id', isLoggedIn, updateCouponCtrl);
couponRouter.delete('/:id', isLoggedIn, deleteCouponCtrl);

export default couponRouter;
