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
import isAdmin from "../middlewares/isAdmin.js";

const categoriesRouter = express.Router();

//routes for categories
categoriesRouter.post(
  "/",
  isLoggedIn,isAdmin,
  upload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getCategoriesCtrl);
categoriesRouter.get("/:category", getCategoryCtrl);
categoriesRouter.put("/:category", isLoggedIn,isAdmin, updateCategoryCtrl);
categoriesRouter.delete("/:category", isLoggedIn,isAdmin, deleteCategoryCtrl);

export default categoriesRouter;
