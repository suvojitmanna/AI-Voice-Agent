import express from "express"
import { getAssistatntConfig } from "../controllers/assistant.controller.js"
const assistantRouter = express.Router()

assistantRouter.get("/config/:userId", getAssistatntConfig)

export default assistantRouter