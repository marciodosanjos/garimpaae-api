import express from "express";
import {
  createCouponCtrl,
  deleteCouponCtrl,
  getCouponCtrl,
  getCouponsCtrl,
  updateCouponCtrl,
} from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponRouter = express.Router();

//routes for coupons
couponRouter.post("/", isLoggedIn, isAdmin, createCouponCtrl);
couponRouter.get("/", isLoggedIn, getCouponsCtrl);
couponRouter.get("/:id", isLoggedIn, getCouponCtrl);
couponRouter.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl);
couponRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl);

export default couponRouter;
