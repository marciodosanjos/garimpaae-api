import express from "express";
import { createColorCtrl, getAllColorsCtrl, getColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/colorsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorsRouter = express.Router();

//routes for categories
colorsRouter.post('/', isLoggedIn,isAdmin, createColorCtrl);
colorsRouter.get('/',getAllColorsCtrl);
colorsRouter.get('/:id',getColorCtrl);
colorsRouter.put('/:id',isLoggedIn, isAdmin,updateColorCtrl);
colorsRouter.delete('/:id',isLoggedIn, isAdmin, deleteColorCtrl);


export default colorsRouter;