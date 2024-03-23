import express from "express";
import { createColorCtrl, getAllColorsCtrl, getColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/colorsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const colorsRouter = express.Router();

//routes for categories
colorsRouter.post('/', isLoggedIn, createColorCtrl);
colorsRouter.get('/',getAllColorsCtrl);
colorsRouter.get('/:id',getColorCtrl);
colorsRouter.put('/:id',isLoggedIn, updateColorCtrl);
colorsRouter.delete('/:id',isLoggedIn, deleteColorCtrl);


export default colorsRouter;