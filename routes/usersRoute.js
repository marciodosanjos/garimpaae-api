import express from "express";
import {
  registerUserCtrl,
  loginUserCrtl,
  getUserProfileCtrl,
  updateShippingAddress,
} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

////routes for users
userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCrtl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);
userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddress);

export default userRoutes;
