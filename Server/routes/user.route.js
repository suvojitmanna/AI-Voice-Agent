import express from "express";
import { googleAuth, logout } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/google", googleAuth);
userRouter.post("/logout", logout);

export default userRouter;