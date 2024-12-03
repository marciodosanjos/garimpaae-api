import asyncHandler from "express-async-handler";
import Product from "../model/Product";

//@desc Fetch products according to query
//@route GET /api/v1/search/
//@access Public
export const searchCtrl = asyncHandler(async (req, res) => {
  const { query } = req.body;

  //   if (!query) {
  //     throw new Error("No search query found");
  //   }

  //   const agg = [
  //     {
  //       $search: {
  //         text: {
  //           query: agg,
  //           path: "products",
  //         },
  //       },
  //     },
  //     {
  //       $limit: 5,
  //     },
  //     // {
  //     //   $project: {
  //     //     _id: 0,
  //     //     title: 1,
  //     //     plot: 1,
  //     //   },
  //     // },
  //   ];

  //   let results = await Product.aggregate(agg);

  res.json({
    message: "Results for your query",
    data: query,
  });
});
