
import User from "../models/user.model.js";
import { genToken } from "../utils/genToken.js";

//login
import axios from "axios";

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google access token is required",
      });
    }
    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { name, email, picture } = data;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    } else if (!user.image) {
      user.image = picture;
      await user.save();
    }

    const jwtToken = genToken(user._id);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Save Assistant
export const saveAssistant = async (req, res) => {
  try {
    const {
      assistantName,
      businessName,
      businessType,
      businessDescription,
      tone,
      theme,
      geminiApiKey,
      pages,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (
      !assistantName ||
      !businessName ||
      !businessType ||
      !businessDescription ||
      !tone ||
      !theme
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    user.assistantName = assistantName;
    user.businessName = businessName
    user.businessType = businessType
    user.businessDescription = businessDescription
    user.tone = tone
    user.theme = theme.charAt(0).toUpperCase() + theme.slice(1);


    if (geminiApiKey) {
      user.geminiApiKey = geminiApiKey
    }
    user.geminiStatus = "Active"
    user.pages = pages || []
    user.isSetupComplete = true
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Assistant saved successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};