import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createBrandCtrl,
  getBrandsCtrl,
  getBrandCtrl,
  updateBrandCtrl,
  deleteBrandCtrl,
} from "../controllers/brandsCtrl.js";

const brandsRouter = express.Router();

//routes for categories
brandsRouter.post("/", isLoggedIn, createBrandCtrl);
brandsRouter.get("/", getBrandsCtrl);
brandsRouter.get("/:category", getBrandCtrl);
brandsRouter.put("/:category", isLoggedIn, updateBrandCtrl);
brandsRouter.delete("/:category", isLoggedIn, deleteBrandCtrl);

export default brandsRouter;
