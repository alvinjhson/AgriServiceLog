import jwt from "jsonwebtoken";
import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();

interface DecodedToken {
    email: string;
}

interface User {
    resetToken: string;
    resetTokenExpiry: number;
}

export const validateResetToken = async (token: string): Promise<{ success: boolean; user?: { email: string }; message?: string }> => {
    try {
        if (!token) {
            throw new Error("Token is missing.");
        }

        const secret = process.env.RESET_TOKEN_SECRET || "yourResetTokenSecret";

        const decoded = jwt.verify(token, secret) as DecodedToken;
        if (!decoded.email) {
            throw new Error("Invalid token payload.");
        }

        const email = decoded.email;

        const result = await db
            .get({
                TableName: "agriaccount",
                Key: { email },
            })
            .promise();

        const user = result.Item as User;

        if (!user) {
            throw new Error("User not found.");
        }

        if (user.resetToken !== token) {
            throw new Error("Token mismatch.");
        }

        if (user.resetTokenExpiry < Date.now()) {
            throw new Error("Token has expired.");
        }

        return { success: true, user: { email } };
    } catch (error) {
        console.error("Reset token validation error:", (error as Error).message);
        return { success: false, message: "Invalid or expired reset token." };
    }
};


