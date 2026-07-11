import express from "express";
import { getCurrentUser, googleAuth, logout } from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const userRouter = express.Router();

userRouter.post("/google", googleAuth);
userRouter.post("/logout", logout);
userRouter.get("/current-user", isAuth, getCurrentUser);

export default userRouter;