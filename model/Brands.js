import mongoose from "mongoose";
const Schema = mongoose.Schema;
import validator from "validator";

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) =>
          validator.isAlphanumeric(value.replace(/\s/g, "")),
        message: "Invalid Brand Name. Only letters and numbers are allowed.",
      },
      set: (value) => validator.escape(value),
    },
    user: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "User",
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
const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;
