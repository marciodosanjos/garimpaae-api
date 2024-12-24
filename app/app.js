import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import userRouter from "../routes/usersRoute.js";
import productsRouter from "../routes/productsRoutes.js";
import categoriesRouter from "../routes/categoriesRoutes.js";
import brandsRouter from "../routes/brandRoutes.js";
import colorsRouter from "../routes/colorsRoutes.js";
import reviewsRouter from "../routes/reviewsRoutes.js";
import ordersRouter from "../routes/ordersRoutes.js";
import Order from "../model/Order.js";
import couponRouter from "../routes/couponRoutes.js";
import cors from "cors";
import enforce from "express-sslify";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import csurf from "csurf";

//import searchRouter from "../routes/searchRoutes.js";

//db connect
dbConnect();
const app = express();

// CSRF protection
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Sanitize data against sql ingection
app.use(mongoSanitize());

// Enforce HTTPS
app.use(enforce.HTTPS({ trustProtoHeader: true }));

// Use Helmet to set security-related HTTP headers
app.use(helmet());

const blockedIPs = new Set();

const blockIPMiddleware = (req, res, next) => {
  const ip = req.ip;
  if (blockedIPs.has(ip)) {
    return res.status(403).json({ message: "Your IP has been blocked." });
  }
  next();
};

// Apply block IP middleware
app.use(blockIPMiddleware);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res /*next*/) => {
    const ip = req.ip;
    blockedIPs.add(ip);
    res.status(429).json({
      status: "fail",
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

app.use(limiter); // Apply rate limiting to all requests

// Enable CORS for specific origins
const corsOptions = {
  origin: ["https://garimpa-ae.com"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//cors
app.use(cors()); //allows any client side to access to the api

//Stripe webhook
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      console.log(err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      //finde the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency: currency,
          paymentMethod: paymentMethod,
          paymentStatus: paymentStatus,
        },
        {
          new: true,
        }
      );
      console.log(order);
    } else {
      return;
    }

    // // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//pass incoming data
app.use(express.json());

//routes
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorsRouter);
app.use("/api/v1/reviews/", reviewsRouter);
app.use("/api/v1/orders/", ordersRouter);
app.use("/api/v1/coupons/", couponRouter);
//app.use("/api/v1/search/", searchRouter);

//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
