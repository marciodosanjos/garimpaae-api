import express from 'express';
import { createProduct, getProductsCtrl,getProductCtrl } from '../controllers/productsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productsRouter = express.Router();

productsRouter.post('/',isLoggedIn, createProduct);
productsRouter.get('/', getProductsCtrl);
productsRouter.get('/:id', getProductCtrl);


export default productsRouter;