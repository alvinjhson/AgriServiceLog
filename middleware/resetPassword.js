import jwt from "jsonwebtoken";
import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();

export const validateResetToken = async (token) => {
  try {
    if (!token) {
      throw new Error("Token is missing.");
    }

    const secret = process.env.RESET_TOKEN_SECRET || "yourResetTokenSecret";

    const decoded = jwt.verify(token, secret);
    if (!decoded.email) {
      throw new Error("Invalid token payload.");
    }

    const email = decoded.email;

    const result = await db.get({
      TableName: "agriaccount",
      Key: { email },
    }).promise();

    const user = result.Item;

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
    console.error("Reset token validation error:", error.message);
    return { success: false, message: "Invalid or expired reset token." };
  }
};

