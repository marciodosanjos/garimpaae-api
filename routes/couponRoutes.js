import express from "express";
import { createCouponCtrl, getCouponsCtrl } from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const couponRouter = express.Router();

//routes for coupons
couponRouter.post('/', isLoggedIn, createCouponCtrl);
couponRouter.get('/', isLoggedIn, getCouponsCtrl);

export default couponRouter;
