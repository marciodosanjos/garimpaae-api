import mongoose from "mongoose";
import validator from "validator";

// Random numbers
const randomTxt = Math.random().toString(36).substring(7).toUpperCase();
const randomNumbers = Math.floor(1000 * Math.random() * 90000);

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    orderItems: [
      {
        type: Object,
        required: [true, "Order items are required"],
      },
    ],
    shippingAddress: {
      type: Object,
      required: [true, "Shipping address is required"],
    },
    totalPrice: {
      type: Number,
      default: 0.0,
      min: [0, "Total price must be at least 0"],
    },
    orderNumber: {
      type: String,
      default: randomTxt + randomNumbers,
      validate: {
        validator: (value) => validator.isAlphanumeric(value),
        message: "Invalid order number. Only letters and numbers are allowed.",
      },
    },
    // For Stripe
    paymentStatus: {
      type: String,
      default: "Not paid",
      enum: ["Not paid", "Paid", "Pending"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Compile the schema to model
const Order = mongoose.model("Order", OrderSchema);

export default Order;
