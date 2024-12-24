import mongoose, { Schema } from "mongoose";
import validator from "validator";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      trim: true,
      validate: {
        validator: (value) =>
          validator.isAlphanumeric(value.replace(/\s/g, "")),
        message: "Invalid Coupon Code. Only letters and numbers are allowed.",
      },
      set: (value) => validator.escape(value), // Sanitizes the input
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: (value) => validator.isDate(value),
        message: "Invalid start date format.",
      },
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: (value) => validator.isDate(value),
        message: "Invalid end date format.",
      },
    },
    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: [0, "Discount must be at least 0"],
      max: [100, "Discount cannot exceed 100"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//coupon is expired
CouponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});

//days left
CouponSchema.virtual("Days left").get(function () {
  const daysLeft =
    Math.ceil(this.endDate - Date.now()) / (1000 * 60 * 60 * 24) + " days left";
  return daysLeft;
});

//end date not greater then start date
CouponSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    next(new Error("End date cannot be less than start date"));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.startDate < Date.now()) {
    next(new Error("Start date cannot be less than today"));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.endDate < Date.now()) {
    next(new Error("End date cannot be less than today"));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.discount <= 0 || this.discount > 100) {
    next(new Error("Desconto nao pode ser menor que zero ou maior que cem"));
  }
  next();
});

//compile to the model
const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
