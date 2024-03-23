import express from "express";
import { createOrderCtrl } from "../controllers/ordersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const ordersRouter = express.Router();

//routes
ordersRouter.post('/', isLoggedIn, createOrderCtrl);

export default ordersRouter
