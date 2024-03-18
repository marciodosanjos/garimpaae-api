import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCategoryCtrl,
  getCategoryCtrl,
  getCategoriesCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} from "../controllers/categoriesCtrl.js";

const categoriesRouter = express.Router();

//routes for categories
categoriesRouter.post("/", isLoggedIn, createCategoryCtrl);
categoriesRouter.get("/", getCategoriesCtrl);
categoriesRouter.get("/:category", getCategoryCtrl);
categoriesRouter.put("/:category", isLoggedIn, updateCategoryCtrl);
categoriesRouter.delete("/:category", isLoggedIn, deleteCategoryCtrl);

export default categoriesRouter;
