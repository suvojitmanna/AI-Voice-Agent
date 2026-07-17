import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createOrder, verifyBilling } from "../controllers/billing.controller.js";

const billingRouter = express.Router();

billingRouter.post("/order", isAuth, createOrder);
billingRouter.post("/verify", isAuth,verifyBilling);

export default billingRouter;