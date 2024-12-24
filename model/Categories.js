import mongoose from "mongoose";
const Schema = mongoose.Schema;
import validator from "validator";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          validator.isAlphanumeric(value.replace(/\s/g, "")),
        message: "Invalid Brand Name. Only letters and numbers are allowed.",
      },
      set: (value) => validator.escape(value),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value) => validator.escape(value), // Sanitizes the input
    },
    image: {
      type: String,
      required: true,
      set: (value) => validator.escape(value), // Sanitizes the input
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

//compile the schema to model
const Category = mongoose.model("Category", CategorySchema);

export default Category;
