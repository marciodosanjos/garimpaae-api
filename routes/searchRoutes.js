import express from "express";
import { searchCtrl } from "../controllers/searchCtrl.js";

const searchRouter = express.Router();

searchRouter.get("/", searchCtrl);

export default searchRouter;
