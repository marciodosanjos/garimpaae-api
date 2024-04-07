import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema(
    {
        code: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate:{
            type: Date,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        }
    },
    {
        timestamps: true,
        toJSON: {virtuals: true}
    }
);

//coupon is expired
CouponSchema.virtual('isExpired').get(function () {
    return this.endDate < Date.now();
})

//days left
CouponSchema.virtual('Days left').get(function () {
    const daysLeft = Math.ceil((this.endDate-Date.now()))/(1000*60*60*24) + ' days left';
    return daysLeft;
})

//end date not greater then start date
CouponSchema.pre('validate', function (next) {
    if (this.endDate < this.startDate) {
        next(new Error('End date cannot be less than start date'));
    }
    next();
});

CouponSchema.pre('validate', function (next) {
    if (this.startDate < Date.now()) {
        next(new Error('Start date cannot be less than today'));
    }
    next();
});

CouponSchema.pre('validate', function (next) {
    if (this.endDate < Date.now()) {
        next(new Error('End date cannot be less than today'));
    }
    next();
});

CouponSchema.pre('validate', function (next) {
    if (this.discount <= 0 || this.discount> 100) {
        next(new Error('Desconto nao pode ser menor que zero ou maior que cem'));
    }
    next();
});

//compile to the model
const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;

