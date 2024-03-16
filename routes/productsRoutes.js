import express from 'express';
import { createProduct, getProductsCtrl,getProductCtrl,updateProductCtrl, deleteProductCtrl } from '../controllers/productsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productsRouter = express.Router();

//routes for products
productsRouter.post('/',isLoggedIn, createProduct);
productsRouter.get('/', getProductsCtrl);
productsRouter.get('/:id', getProductCtrl);
productsRouter.put('/:id',isLoggedIn, updateProductCtrl);
productsRouter.delete('/:id/delete',isLoggedIn, deleteProductCtrl);

export default productsRouter;