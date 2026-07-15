import express from "express"
import { askAssistant, getAssistatntConfig } from "../controllers/assistant.controller.js"
const assistantRouter = express.Router()

assistantRouter.get("/config/:userId", getAssistatntConfig)
assistantRouter.post("/ask", askAssistant)

export default assistantRouter