import express from "express";
import {
  createOrderCtrl,
  getOrdersCtrl,
  getOrderCtrl,
  updateOrderCtrl,
  getStatsCtrl,
  deleteOrderCtrl,
} from "../controllers/ordersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const ordersRouter = express.Router();

//generic routes
ordersRouter.get("/stats", isLoggedIn, getStatsCtrl);

//specific routes
ordersRouter.post("/", isLoggedIn, isAdmin, createOrderCtrl);
ordersRouter.get("/", isLoggedIn, getOrdersCtrl);
ordersRouter.get("/:id", isLoggedIn, getOrderCtrl);
ordersRouter.put("/update/:id", isLoggedIn, isAdmin, updateOrderCtrl);
ordersRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteOrderCtrl);

export default ordersRouter;
