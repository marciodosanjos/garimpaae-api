import mongoose from "mongoose";
const Schema = mongoose.Schema;
import validator from "validator";

const ColorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Color name is required"],
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
      required: [true, "User is required"],
      ref: "User",
      set: (value) => validator.escape(value), // Sanitizes the input
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

//compile the schema to model
const Color = mongoose.model("Color", ColorSchema);
export default Color;
