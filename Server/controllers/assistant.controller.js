import { generateGeminiResponse } from "../configs/gemini.js"
import User from "../models/user.model.js"

export const getAssistatntConfig = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId).select("-geminiApiKey")
        if (!user) {
            return res.status(404).json({ message: "Failed to get user" })
        }
        return res.status(200).json({ success: true, message: "Assistant Config data", user })
    } catch (error) {
        return res.status(500).json({ message: `Assistant Config failed ${error}` })


    }
}


export const askAssistant = async (req, res) => {
    try {
        const { message, userId, currentPath } = req.body;

        if (!message || !userId) {
            return res.status(400).json({ message: "message and userId are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }
        if (!user.geminiApiKey) {
            return res.status(404).json({ message: "gemini api key is not added" });
        }

        if (user.plan === "free" && user.totalMessages >= user.requestLimit) {
            return res.status(400).json({ message: "Free limit reached" });
        }

        if (user.plan === "pro" && new Date(user.proExpiresAt) < new Date()) {
            user.plan = "free";
            await user.save();
            return res.status(400).json({ message: "Pro plan expired" });
        }

        const cleanMessage = message.toLowerCase();
        let wantNavigation = false;

        if (user.enableNavigation) {
            const navigationWords = [
                "open", "go", "start", "show", "navigate", "take me",
            ];
            wantNavigation = navigationWords.some((word) => cleanMessage.startsWith(word));
        }

        if (wantNavigation) {
            const matchedPage = user.pages.find((page) => {
                const pageName = page.name.toLowerCase();

                return (
                    cleanMessage.includes(pageName) ||
                    page.keywords.some((keyword) =>
                        cleanMessage.includes(keyword.toLowerCase())
                    )
                );
            });

            if (matchedPage) {
                if (currentPath === matchedPage.path) {
                    return res.json({
                        success: true,
                        response: `${matchedPage.name} Already Open`
                    });
                }
                return res.json({
                    success: true,
                    action: "navigation",
                    path: matchedPage.path,
                    response: `opening ${matchedPage.name}`,
                });
            }
        }

        const prompt = `You are ${user.assistantName}.
        Business Name:${user.businessName}
        Business Type:${user.businessType}
        Business Description:${user.businessDescription}
        Assistant Tone:${user.tone}

        Rules:
        - keep replies under 15 words
        - Give fast direct responses
        - Talk naturally
        - Behave like a smart voice assistant
        - Avoid long explanations
        - Keep responses short for quick voice playback

        User Question:
        ${message}`;

        const aiResponse = await generateGeminiResponse({
            prompt,
            apiKey: user.geminiApiKey,
            user
        });

        if (user.plan) {
            user.totalMessages += 1;
            await user.save();
        }

        return res.json({
            success: true,
            aiResponse
        });

    } catch (error) {
        console.error("Assistant AI Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};