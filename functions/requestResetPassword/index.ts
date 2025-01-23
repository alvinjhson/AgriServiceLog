import AWS from "aws-sdk";
import { sendResponse } from "../../responses";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const db = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

async function forgotPassword(email) {
  try {
    
    const user = await db.get({
      TableName: "agriaccount",
      Key: { email },
    }).promise();

    if (!user.Item) {
      return { success: false, message: "Email not found." };
    }

 
    const secret = process.env.RESET_TOKEN_SECRET || "yourResetTokenSecret";
    const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
  

 
    const expirationTime = Date.now() + 3600 * 1000; // 1 hour
    await db
      .update({
        TableName: "agriaccount",
        Key: { email },
        UpdateExpression: "set resetToken = :token, resetTokenExpiry = :expiry",
        ExpressionAttributeValues: {
          ":token": token,
          ":expiry": expirationTime,
        },
      })
      .promise();
      const FRONTEND_BASE_URL = process.env.VITE_FRONTEND_BASE_URL || "http://localhost:5173";

  if (!FRONTEND_BASE_URL) {
  throw new Error("FRONTEND_BASE_URL is not defined in the environment variables.");
}

      const resetLink = `${FRONTEND_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
        console.log("Reset Link:", resetLink);

    if (process.env.NODE_ENV !== "production") {
      console.log(`Mock email sent. Reset link: ${resetLink}`);
    }
    // const sourceEmail = process.env.SOURCE_EMAIL;
    // if (!sourceEmail) {
    //   throw new Error("SOURCE_EMAIL is not defined in the environment variables");
    // }
    // const  sourceEmail = import.meta.env.VITE_SOURCE_EMAIL;
   
    await ses
      .sendEmail({
        Source: "jhsonagri@gmail.com",
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: "Password Reset Request" },
          Body: {
            Text: { Data: `Click the link to reset your password: ${resetLink}` },
          },
        },
      })
      .promise();

    return { success: true, message: "Password reset link sent to email." };
  } catch (error) {
    console.error("Error handling forgot password:", error);
    return { success: false, message: "Failed to send reset link." };
  }
}


export const handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return sendResponse(400, { success: false }, "Email is required.");
    }

    const result = await forgotPassword(email);

    return sendResponse(result.success ? 200 : 400, result, result.message);
  } catch (error) {
    console.error("Forgot password handler error:", error);
    return sendResponse(500, { success: false }, "Internal server error.");
  }
};
