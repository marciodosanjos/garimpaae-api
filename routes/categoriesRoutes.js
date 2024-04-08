import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCategoryCtrl,
  getCategoryCtrl,
  getCategoriesCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} from "../controllers/categoriesCtrl.js";
import upload from "../config/fileUpload.js";

const categoriesRouter = express.Router();

//routes for categories
categoriesRouter.post(
  "/",
  isLoggedIn,
  upload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getCategoriesCtrl);
categoriesRouter.get("/:category", getCategoryCtrl);
categoriesRouter.put("/:category", isLoggedIn, updateCategoryCtrl);
categoriesRouter.delete("/:category", isLoggedIn, deleteCategoryCtrl);

export default categoriesRouter;
