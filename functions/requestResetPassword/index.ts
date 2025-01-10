// import AWS from "aws-sdk";
// import { sendResponse } from "../../responses";
// import crypto from "crypto";

// const db = new AWS.DynamoDB.DocumentClient();
// const ses = new AWS.SES();

// async function forgotPassword(email) {
//   try {
//     const token = crypto.randomBytes(32).toString("hex");
//     const expirationTime = Date.now() + 3600 * 1000; // 1 hour

//     await db
//       .update({
//         TableName: "agriaccount",
//         Key: { email },
//         UpdateExpression: "set resetToken = :token, resetTokenExpiry = :expiry",
//         ExpressionAttributeValues: {
//           ":token": token,
//           ":expiry": expirationTime,
//         },
//       })
//       .promise();

//     const resetLink = `https://z09zwi52qg.execute-api.eu-north-1.amazonaws.com/auth/reset-password?token=${token}`;
//     console.log(`Mock email sent. Reset link: ${resetLink}`);
    

//     await ses
//       .sendEmail({
//         Source: "jhsonagri@gmail.com",
//         Destination: { ToAddresses: [email] },
//         Message: {
//           Subject: { Data: "Password Reset Request" },
//           Body: {
//             Text: { Data: `Click the link to reset your password: ${resetLink}` },
//           },
//         },
//       })
//       .promise();

//     return { success: true, message: "Password reset link sent to email." };
//   } catch (error) {
//     console.error("Error handling forgot password:", error);
//     return { success: false, message: "Failed to send reset link." };
//   }
// }

// export const handler = async (event) => {
//   const { email } = JSON.parse(event.body);

//   if (!email) {
//     return sendResponse(400, { success: false }, "Email is required.");
//   }

//   const result = await forgotPassword(email);

//   return sendResponse(result.success ? 200 : 400, result, result.message);
// };
import AWS from "aws-sdk";
import { sendResponse } from "../../responses";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const db = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

async function forgotPassword(email) {
  try {
    // Check if the email exists
    const user = await db.get({
      TableName: "agriaccount",
      Key: { email },
    }).promise();

    if (!user.Item) {
      return { success: false, message: "Email not found." };
    }

    // Generate reset token using JWT
    const secret = process.env.RESET_TOKEN_SECRET || "yourResetTokenSecret";
    const token = jwt.sign({ email }, secret, { expiresIn: "1h" });

    // Update the user's record in DynamoDB
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

    // Generate reset link
    const resetLink = `https://z09zwi52qg.execute-api.eu-north-1.amazonaws.com/auth/reset-password?token=${encodeURIComponent(token)}`;

    // Log reset link in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.log(`Mock email sent. Reset link: ${resetLink}`);
    }

    // Send email via SES
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
