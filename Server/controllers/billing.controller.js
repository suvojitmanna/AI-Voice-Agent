import crypto from "crypto";
import Billing from "../models/billing.model.js";
import User from "../models/user.model.js";
import { instance } from "../configs/razorPay.js";

export const createOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.userId;

        let amount = 0;

        if (plan === "Pro") {
            amount = 699;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid plan",
            });
        }

        const order = await instance.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        await Billing.create({
            userId,
            amount,
            plan,
            orderId: order.id,
            status: "created",
        });

        return res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Order creation failed",
        });
    }
};

export const verifyBilling = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const userId = req.userId;

        const billing = await Billing.findOne({
            orderId: razorpay_order_id,
        });

        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing not found",
            });
        }

        if (billing.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment already verified",
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            billing.status = "failed";
            await billing.save();

            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        billing.paymentId = razorpay_payment_id;
        billing.status = "paid";

        await billing.save();

        const user = await User.findByIdAndUpdate(
            billing.userId,
            {
                plan: "Pro",
                requestLimit: 999999,
                proExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        return res.json({
            success: true,
            message: "Payment verified successfully",
            user,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};