import User from "../models/user.model.js"

export const getAssistatntConfig = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId).select("-geminiApiKey")
        if (!user) {
            return res.status(404).json({ message: "Failed to get user" })
        }
        return res.status(200).json({success:true, message: "Assistant Config data", user })
    } catch (error) {
        return res.status(500).json({ message: `Assistant Config failed ${error}` })

        
    }
}