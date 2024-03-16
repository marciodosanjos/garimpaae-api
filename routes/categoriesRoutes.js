import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCategoryCtrl } from '../controllers/categoriesCtrl.js';


const categoriesRouter = express.Router();

//routes for categories
categoriesRouter.post('/',isLoggedIn, createCategoryCtrl);

export default categoriesRouter;
