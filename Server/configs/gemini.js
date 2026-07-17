import User from "../models/user.model.js";

const Gemini_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateGeminiResponse = async ({
    prompt,
    apiKey,
    user,
}) => {
    if (!apiKey) {
        throw new Error("Gemini API key missing");
    }

    const MAX_RETRIES = 2;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(`${Gemini_URL}?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const error = await response.json();

                switch (response.status) {
                    case 400:
                    case 401:
                    case 403:
                        if (user.geminiStatus !== "Invalid") {
                            user.geminiStatus = "Invalid";
                            await user.save();
                        }
                        throw new Error(error.error?.message || "Invalid Gemini API Key");

                    case 429:
                        if (user.geminiStatus !== "Quota_exceeded") {
                            user.geminiStatus = "Quota_exceeded";
                            await user.save();
                        }
                        throw new Error(error.error?.message || "Quota exceeded");

                    case 500:
                    case 503:
                    case 504:
                        if (attempt < MAX_RETRIES - 1) {
                            const delay = Math.pow(2, attempt) * 1000;
                            console.log(
                                `Gemini busy. Retry ${attempt + 1}/${MAX_RETRIES} after ${delay}ms`
                            );
                            await sleep(delay);
                            continue;
                        }

                        throw new Error(
                            "Gemini servers are busy. Please try again in a few seconds."
                        );

                    default:
                        throw new Error(error.error?.message || "Gemini API Error");
                }
            }

            if (user.geminiStatus !== "Active") {
                user.geminiStatus = "Active";
                await user.save();
            }

            const data = await response.json();

            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error("No response generated");
            }

            return text.trim();

        } catch (error) {
            // Retry only for temporary network errors
            if (
                attempt < MAX_RETRIES - 1 &&
                (error.name === "FetchError" ||
                    error.message.includes("fetch failed") ||
                    error.message.includes("network"))
            ) {
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`Network retry after ${delay}ms`);
                await sleep(delay);
                continue;
            }

            console.error("Gemini Error:", error.message);
            throw error;
        }
    }
};