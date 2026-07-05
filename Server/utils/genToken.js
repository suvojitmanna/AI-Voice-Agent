import jwt from "jsonwebtoken";

export const genToken = (userId) => {
    try {
        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
};