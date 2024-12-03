import Category from "../model/Categories.js";
import asyncHandler from "express-async-handler";

//@desc Create a new category
//@route POST /api/category
//@access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const categoryImage = req?.file?.path;

  //check if it already exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category already exists");
  }
  //create
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: categoryImage,
  });
  res.json({
    message: "Category created, successfully",
    data: category,
  });
});

//@desc Fetch all existing categories
//@route GET /api/categories
//@access Public
export const getCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({
    status: "Categories fetched successfully",
    data: categories,
  });
});

//@desc Show a single category
//@route GET /api/category/:category
//@access Public
export const getCategoryCtrl = asyncHandler(async (req, res) => {
  const categoryName = req.params.category;

  const category = await Category.find({
    name: { $regex: categoryName, $options: "i" },
  });

  if (category.length === 0) {
    throw new Error("No category with this name");
  }

  res.json({
    status: "Category found",
    data: category,
  });
});

//@desc Update a single category
//@route PUT /api/category/:category
//@access Private/Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name, user, image, products } = req.body;
  const param = req.params.category;
  const categoryFound = await Category.find({ name: param });

  if (!categoryFound) {
    throw new Error("The category doesnt exist");
  }

  const category = await Category.findOneAndUpdate(
    { name: param },
    { name: name, user: req.userAuthId },
    { new: true }
  );

  res.json({
    message: "Category updated sucessfully",
    data: category,
  });
});

//@desc Delete a single category
//@route DELETE /api/categories/:category
//@access Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const param = req.params.category;

  const categoryFound = await Category.find({ name: param });

  if (categoryFound.length === 0) {
    throw new Error("No category found");
  }

  await Category.findOneAndDelete({ name: param });

  res.json({
    message: "Category deleted",
  });
});
