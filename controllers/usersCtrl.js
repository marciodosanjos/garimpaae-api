import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

//@desc Register User
//@route POST /api/users/register
//@access Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  //check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    //throw error
    throw new Error("User alreary exists");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    message: "User registrated successfully",
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

  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      },
      hasShippingAddress: true,
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "user shipping address updated",
    user,
  });
});

export const updateUserLoginData = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please specify an email and a password");
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.userAuthId,
      {
        email,
        password,
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
