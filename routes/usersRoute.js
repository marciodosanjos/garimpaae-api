import express from "express";
import {
  registerUserCtrl,
  loginUserCrtl,
  getUserProfileCtrl,
  updateShippingAddress,
} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const userRoutes = express.Router();

////routes for users
userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCrtl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);
userRoutes.put("/update/shipping", isLoggedIn, isAdmin, updateShippingAddress);

export default userRoutes;
