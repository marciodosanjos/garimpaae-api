import express from "express";
import {
  createOrderCtrl,
  getOrdersCtrl,
  getOrderCtrl,
  updateOrderCtrl,
  getStatsCtrl,
} from "../controllers/ordersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const ordersRouter = express.Router();

//generic routes
ordersRouter.get("/stats", isLoggedIn, getStatsCtrl);

//specific routes
ordersRouter.post("/", isLoggedIn, createOrderCtrl);
ordersRouter.get("/", isLoggedIn, getOrdersCtrl);
ordersRouter.get("/:id", isLoggedIn, getOrderCtrl);
ordersRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);

export default ordersRouter;
