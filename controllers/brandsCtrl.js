import Brand from "../model/Brands.js";
import asyncHandler from "express-async-handler";

//@desc Create a new brand
//@route POST /api/brand
//@access Private/Admin
export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name, user, image, products } = req.body;
  //check if it already exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand already exists");
  }
  //create
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    message: "Brand created, successfully",
    data: brand,
  });
});

//@desc Fetch all existing categories
//@route GET /api/brands
//@access Public
export const getBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({
    status: "Brands fetched successfully",
    data: brands,
  });
});

//@desc Show a single brand
//@route GET /api/brands/:brand
//@access Public
export const getBrandCtrl = asyncHandler(async (req, res) => {
  const brandName = req.params.brand;

  const brand = await Brand.find({
    name: { $regex: brandName, $options: "i" },
  });

  if (brand.length === 0) {
    throw new Error("No brand with this name");
  }

  res.json({
    status: "Brand found",
    data: brand,
  });
});

//@desc Update a single brand
//@route PUT /api/brand/:brand
//@access Private/Admin
export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name, user, image, products } = req.body;
  const param = req.params.brand;
  const brandFound = await Brand.find({ name: param });

  if (!brandFound) {
    throw new Error("The brand doesnt exist");
  }

  const brand = await Brand.findOneAndUpdate(
    { name: param },
    { name: name, user: req.userAuthId },
    { new: true }
  );

  res.json({
    message: "Brand updated sucessfully",
    data: brand,
  });
});

//@desc Delete a single category
//@route DELETE /api/categories/:category
//@access Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  const param = req.params.category;

  const brandFound = await Brand.find({ name: param });

  if (brandFound.length === 0) {
    throw new Error("No brand found");
  }

  await Brand.findOneAndDelete({ name: param });

  res.json({
    message: "Brand deleted",
  });
});
