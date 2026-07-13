import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./configs/Db.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
         origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.json("✅ Server is running");
});

app.use("/api/user", userRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    await connectDb();
    console.log(`✅ Server Started on port ${PORT}`);
});