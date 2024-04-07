import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "User",
    },
   
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

//compile the schema to model
const Color = mongoose.model("Color", ColorSchema);
export default Color;
