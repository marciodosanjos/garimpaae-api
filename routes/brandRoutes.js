import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createBrandCtrl,
  getBrandsCtrl,
  getBrandCtrl,
  updateBrandCtrl,
  deleteBrandCtrl,
} from "../controllers/brandsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const brandsRouter = express.Router();

//routes for categories
brandsRouter.post("/", isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get("/", getBrandsCtrl);
brandsRouter.get("/:id", getBrandCtrl);
brandsRouter.put("/update/:id", isLoggedIn, isAdmin, updateBrandCtrl);
brandsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteBrandCtrl);

export default brandsRouter;
