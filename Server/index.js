import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./configs/Db.js";
import userRouter from "./routes/user.route.js";
import assistantRouter from "./routes/assistant.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const privateCors =
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })

const publicCors =
    cors({
        origin: "*",
    })

app.get("/", (req, res) => {
    res.json("✅ Server is running");
});

app.use("/api/user",privateCors, userRouter);
app.use("/api/assistant",publicCors, assistantRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    await connectDb();
    console.log(`✅ Server Started on port ${PORT}`);
});