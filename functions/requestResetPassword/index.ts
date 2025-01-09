import AWS from "aws-sdk";
import { sendResponse } from "../../responses";
import crypto from "crypto";

const db = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

async function forgotPassword(email) {
  try {
    const token = crypto.randomBytes(32).toString("hex");
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

    const resetLink = `https://z09zwi52qg.execute-api.eu-north-1.amazonaws.com/auth/reset-password?token=${token}`;
    console.log(`Mock email sent. Reset link: ${resetLink}`);
    

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
  const { email } = JSON.parse(event.body);

  if (!email) {
    return sendResponse(400, { success: false }, "Email is required.");
  }

  const result = await forgotPassword(email);

  return sendResponse(result.success ? 200 : 400, result, result.message);
};
