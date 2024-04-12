import express from "express";
import {
  createProduct,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const productsRouter = express.Router();

//routes for products
productsRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  createProduct
);
productsRouter.get("/", getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);
productsRouter.put("/:id", isLoggedIn, isAdmin, updateProductCtrl);
productsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteProductCtrl);

export default productsRouter;
