import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Coupon from "../model/Coupon.js";
dotenv.config();

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  //get the coupon
  const { coupon } = req?.query;
  const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });

  if (couponFound?.isExpired) {
    throw new Error("Coupon expired");
  }

  // let discount = null;
  // if (couponFound) {
  //   //get discount
  //   discount = couponFound?.discount / 100;
  // }

  //Get payload (user, orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice, status } = req.body;

  //find the user
  const user = await User.findById(req.userAuthId);

  //check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Provide address");
  }

  //check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No order items");
  }

  //prace the order - save into db
  const order = await Order.create({
    user: req.userAuthId,
    orderItems,
    shippingAddress,
    totalPrice,
    //totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    status,
  });

  //push order into user
  user.orders.push(order?._id);
  await user.save();

  //update the product qty and qty sold
  const products = await Product.find({ _id: { $in: orderItems } });

  if (products.length <= 0) {
    throw new Error("No products");
  }

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });

    if (product) {
      product.totalSold += order.qty;
    }

    await product.save();
  });

  //make payment (stripe)
  //convert ordem items to have same data structure from Stripe;
  const convertedOrders = orderItems?.map((item) => {
    return {
      price_data: {
        currency: "brl",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send({ url: session.url });

  //payment webhook
  //update the user order

  // res.json({
  //     success:true,
  //     message: 'Order controller',
  //     order,
  //     user

  // })
});

//get all orders
export const getOrdersCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  if (!orders) {
    throw new Error("No order found");
  }

  res.json({
    success: true,
    message: "All orders",
    data: orders,
  });
});

//get single order by id
export const getOrderCtrl = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("No order matching id found");
  }

  res.json({
    success: true,
    message: "Order found",
    data: order,
  });
});

//update order status
export const updateOrderCtrl = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  res.json({
    success: true,
    message: "Order updated",
    data: order,
  });
});

//delete order
export const deleteOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;

  await Order.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Order deleted",
  });
});

//get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//access private/admin
export const getStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        minSale: {
          $min: "$totalPrice",
        },
        maxSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        avgSales: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDay());

  const salesToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSalesToday: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  res.json({
    success: true,
    message: "Sum of orders",
    data: orderStats,
    salesToday,
  });
});
