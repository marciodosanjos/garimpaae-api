import mongoose from "mongoose";

//random numbers
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000* Math.random() * 90000);

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            type: Object,
        required:true
        }
    ],
    shippingAddress: {
        type: Object,
        required:true
    },
     totalPrice: {
        type: Number,
        default:0.0
    },
    orderNumber: {
        type: String,
        default: randomTxt + randomNumbers
    },
    //for strype
    paymentStatus: {
        type: String,
        default:'Not paid'
    },
    paymentMethod:{
        type: String,
        default: 'Not specified'
    },
    currency:{
        type: String,
        default: 'Not specified'
    },
    //admin
    status:{
        type: String,
        default: 'Pending',
        enum:['pending', 'processing', 'shipped', 'delivered']
    },
    deliveryAt: {
        type: Date,
    }
},
{
    timestamps:true
});

//compile
const Order = mongoose.model('Order', OrderSchema);

export default Order;