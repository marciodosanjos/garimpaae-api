import express from 'express';
import { createProduct, getProductsCtrl } from '../controllers/productsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productsRouter = express.Router();

productsRouter.post('/',isLoggedIn, createProduct);
productsRouter.get('/', getProductsCtrl);


export default productsRouter;