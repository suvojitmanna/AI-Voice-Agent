import express from "express";
import { getCurrentUser, googleAuth, logout, saveAssistant } from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const userRouter = express.Router();

userRouter.post("/google", googleAuth);
userRouter.get("/logout", logout);
userRouter.get("/current-user", isAuth, getCurrentUser);
userRouter.post("/save-assistant", isAuth, saveAssistant);

export default userRouter;