import mongoose from "mongoose";
import validator from "validator";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      validate: {
        validator: (value) =>
          validator.isAlphanumeric(value.replace(/\s/g, "")),
        message: "Invalid Product Name. Only letters and numbers are allowed.",
      },
      set: (value) => validator.escape(value), // Sanitizes the input
    },
    category: {
      type: String,
      ref: "Category",
      required: [true, "Category is required"],
      set: (value) => validator.escape(value), // Sanitizes the input
    },
    sizes: {
      type: [String],
      required: [true, "Sizes are required"],
      validate: {
        validator: (value) =>
          value.every((size) =>
            validator.isAlphanumeric(size.replace(/\s/g, ""))
          ),
        message: "Invalid Size. Only letters and numbers are allowed.",
      },
    },
    colors: {
      type: [String],
      required: [true, "Colors are required"],
      validate: {
        validator: (value) =>
          value.every((color) =>
            validator.isAlphanumeric(color.replace(/\s/g, ""))
          ),
        message: "Invalid Color. Only letters and numbers are allowed.",
      },
    },
    user: {
      type: mongoose.Schema.Types.String,
      required: [true, "User is required"],
      ref: "User",
      set: (value) => validator.escape(value), // Sanitizes the input
    },
    images: [
      {
        type: String,
        required: [true, "Image URL is required"],
        validate: {
          validator: (value) => validator.isURL(value),
          message: "Invalid URL format.",
        },
        set: (value) => validator.escape(value), // Sanitizes the input
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be at least 0"],
    },
    totalQty: {
      type: Number,
      required: [true, "Total quantity is required"],
      min: [0, "Total quantity must be at least 0"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Compile the schema to model
const Product = mongoose.model("Product", ProductSchema);

export default Product;
