import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import { sendResponse } from "../../responses";
import { validateResetToken } from "../../middleware/resetPassword"; 

const db = new AWS.DynamoDB.DocumentClient();

async function resetPassword(token, newPassword) {
    const validation = await validateResetToken(token);
  
    if (!validation.success || !validation.user) {
      return { success: false, message: "Invalid or expired reset token." };
    }
  
    const email = validation.user.email; 
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    try {
      await db
        .update({
          TableName: "agriaccount",
          Key: { email },
          UpdateExpression: "set password = :password remove resetToken, resetTokenExpiry",
          ExpressionAttributeValues: {
            ":password": hashedPassword,
          },
        })
        .promise();
  
      return { success: true, message: "Password reset successfully." };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { success: false, message: "Failed to reset password." };
    }
  }
  

export const handler = async (event) => {
  try {
    const { token, newPassword } = JSON.parse(event.body);

    
    if (!token || !newPassword) {
      return sendResponse(
        400,
        { success: false },
        "Token and new password are required."
      );
    }

    const result = await resetPassword(token, newPassword);
    return sendResponse(result.success ? 200 : 400, result, result.message);
  } catch (error) {
    console.error("Error in reset password handler:", error);
    return sendResponse(
      500,
      { success: false },
      "Internal server error. Please try again later."
    );
  }
};
