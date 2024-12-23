import Category from "../model/Categories.js";
import Product from "../model/Product.js";
import Brands from "../model/Brands.js";
import asyncHandler from "express-async-handler";
import Colors from "../model/Colors.js";

//@desc Register Product
//@route POST /api/v1/products
//@access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    reviews,
    price,
    totalQty,
    totalSold,
  } = req.body;

  const convertedImages = req?.files?.map((file) => file?.path);

  // Sanitize and validate inputs
  if (!validator.isLength(name, { min: 1 })) {
    return res.status(400).json({ message: "Product name cannot be empty." });
  }
  if (!validator.isLength(category, { min: 1 })) {
    return res.status(400).json({ message: "Category cannot be empty." });
  }
  if (
    !Array.isArray(sizes) ||
    !sizes.every((size) => validator.isAlphanumeric(size.replace(/\s/g, "")))
  ) {
    return res.status(400).json({
      message: "Invalid sizes. Only letters and numbers are allowed.",
    });
  }
  if (
    !Array.isArray(colors) ||
    !colors.every((color) => validator.isAlphanumeric(color.replace(/\s/g, "")))
  ) {
    return res.status(400).json({
      message: "Invalid colors. Only letters and numbers are allowed.",
    });
  }
  if (!validator.isLength(user, { min: 1 })) {
    return res.status(400).json({ message: "User cannot be empty." });
  }
  if (
    !Array.isArray(images) ||
    !images.every((image) => validator.isURL(image))
  ) {
    return res.status(400).json({ message: "Invalid image URLs." });
  }
  if (!validator.isNumeric(price.toString()) || price < 0) {
    return res
      .status(400)
      .json({ message: "Price must be a positive number." });
  }
  if (!validator.isNumeric(totalQty.toString()) || totalQty < 0) {
    return res
      .status(400)
      .json({ message: "Total quantity must be a positive number." });
  }

  //check if product exists
  const productExists = await Product.findOne({ name });

  if (productExists) {
    throw new Error("Product already exists");
  }

  //find the category
  const categoryFound = await Category.findOne({ name: category });

  if (!category) {
    throw new Error("Category not found. Create one or check the existing");
  }

  //find the brand
  const brandFound = await Brands.findOne({ name: brand });

  if (!brandFound) {
    throw new Error("Brand not found. Create one or check the existing");
  }

  // Sanitize inputs
  const sanitizedData = {
    name: validator.escape(name),
    category: validator.escape(category),
    sizes: sizes.map((size) => validator.escape(size)),
    colors: colors.map((color) => validator.escape(color)),
    user: validator.escape(user),
    images: images.map((image) => validator.escape(image)),
    price,
    totalQty,
  };

  //create product
  const product = await Product.create({
    ...sanitizedData,
    user: req.userAuthId,
    reviews,
    images: convertedImages,
  });

  //push the product into category
  categoryFound.products.push(product._id);

  //resave
  await categoryFound.save();

  //push the product into brand
  brandFound.products.push(product._id);

  //resave
  await brandFound.save();

  //send the response
  res.status(201).json({
    status: "success",
    message: "Product registered successfully",
    data: product,
  });
});

//@desc Fetch all products
//@route GET /api/v1/products
//@access Public
export const getProductsCtrl = asyncHandler(async (req, res) => {
  //query
  let productQuery = Product.find({});

  //query with projection
  //let productQuery = Product.find({}, { name: 1, description: 1 });

  //sort
  if (req.query.sort) {
    const sortOrder = req.query.sort === "price_asc" ? 1 : -1;
    productQuery = productQuery.sort({ price: sortOrder });
  }

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find(
      {
        name: { $regex: req.query.name, $options: "i" },
      },
      { name: 1 }
    );
  }

  //search by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  //search by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  //search by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }
  //search by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }

  //search by price range
  if (req.query.price) {
    let priceRange = req.query.price.split("-");

    //how to: in this case we need to use some mongodb operators inside the find query
    //gte: greater than or equal to
    //lte: less than or equal to

    productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //pagination

  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  //startIdx
  const startIndex = (page - 1) * limit;

  //endIdx
  const endIndex = page * limit;

  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await the query
  const products = await productQuery.populate("reviews");

  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    data: products,
  });
});

//@desc Fetch a single product
//@route GET /api/v1/products/:id
//@access Public
export const getProductCtrl = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findById(productId).populate("reviews");

  if (!product) {
    throw new Error("No product found");
  }

  res.json({
    status: "Success",
    data: product,
  });
});

//@desc Update a single product
//@route POST /api/v1/products/:id
//@access Admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    fullname,
    images,
    reviews,
    price,
    totalQty,
    totalSold,
  } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      fullname,
      images,
      reviews,
      price,
      totalQty,
      totalSold,
    },
    { new: true }
  );

  res.json({
    message: "Product successully updated",
    data: updatedProduct,
  });
});

//@desc Delete a single product
//@route POST /api/v1/products/:id
//@access Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new Error("Product not found");
  }

  res.json({
    message: `Product with id ${req.params.id} deleted`,
  });
});
