import mongoose from "mongoose";
import validator from "validator";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
    message: {
      type: String,
      required: [true, "Please add a message"],
      trim: true,
      validate: {
        validator: (value) => validator.isLength(value, { min: 1 }),
        message: "Message cannot be empty.",
      },
      set: (value) => validator.escape(value), // Sanitizes the input
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating between 1 and 5"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
