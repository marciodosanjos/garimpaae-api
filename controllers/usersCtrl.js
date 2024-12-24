import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import validator from "validator";
import jwt from "jsonwebtoken";

//@desc Register User
//@route POST /api/users/register
//@access Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  // Sanitize and validate inputs
  if (!validator.isLength(fullname, { min: 1 })) {
    return res.status(400).json({ message: "Full name cannot be empty." });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (!validator.isLength(password, { min: 6 })) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    // Throw error
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    fullname: validator.escape(fullname),
    email: validator.normalizeEmail(email),
    password: hashedPassword,
    isAdmin: isAdmin || false, // Default role is "user"
  });

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: user,
  });
});

//@desc Login User
//@route POST /api/users/login
//@access Public

export const loginUserCrtl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Find user in db by email only
  const userFound = await User.findOne({ email });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "success",
      msg: "Login successfull",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid login");
  }
});

// @desc Get user profile
// @route GET /api/vi/users/profile
// @access Private

export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  //finde the user

  const user = await User.findById(req.userAuthId).populate("orders");

  res.json({
    status: "success",
    message: "User profile",
    data: user,
  });
});

// @desc Updating shipping address
// @route GET /api/vi/users/update/shipping
// @access Private
export const updateShippingAddress = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phone,
    country,
  } = req.body;

  // Sanitize and validate inputs
  if (!validator.isLength(firstName, { min: 1 })) {
    return res.status(400).json({ message: "First name cannot be empty." });
  }
  if (!validator.isLength(lastName, { min: 1 })) {
    return res.status(400).json({ message: "Last name cannot be empty." });
  }
  if (!validator.isLength(address, { min: 1 })) {
    return res.status(400).json({ message: "Address cannot be empty." });
  }
  if (!validator.isLength(city, { min: 1 })) {
    return res.status(400).json({ message: "City cannot be empty." });
  }
  if (!validator.isLength(postalCode, { min: 1 })) {
    return res.status(400).json({ message: "Postal code cannot be empty." });
  }
  if (!validator.isLength(province, { min: 1 })) {
    return res.status(400).json({ message: "Province cannot be empty." });
  }
  if (!validator.isMobilePhone(phone)) {
    return res.status(400).json({ message: "Invalid phone number." });
  }
  if (!validator.isLength(country, { min: 1 })) {
    return res.status(400).json({ message: "Country cannot be empty." });
  }

  // Sanitize inputs
  const sanitizedData = {
    firstName: validator.escape(firstName),
    lastName: validator.escape(lastName),
    address: validator.escape(address),
    city: validator.escape(city),
    postalCode: validator.escape(postalCode),
    province: validator.escape(province),
    phone: validator.escape(phone),
    country: validator.escape(country),
  };

  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: sanitizedData,
      hasShippingAddress: true,
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "User shipping address updated",
    user,
  });
});

export const updateUserLoginData = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please specify an email and a password");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.findByIdAndUpdate(
      req.userAuthId,
      {
        email,
        password: hashedPassword,
      },
      { new: true }
    );

    res.json({
      status: "success",
      message: "user login data updated",
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});
