import express from 'express';
import { createProduct } from '../controllers/productsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const productsRouter = express.Router();

productsRouter.post('/',isLoggedIn, createProduct);


export default productsRouter;