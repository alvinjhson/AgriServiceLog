import AWS from "aws-sdk";
import { sendResponse } from "../../responses";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: { queryStringParameters: { token?: string } }) => {
  try {
    const { token } = event.queryStringParameters || {};

    if (!token) {
      return sendResponse(400, { success: false }, "Token is required."); 
    }

    const user = await db.scan({
      TableName: "agriaccount",
      FilterExpression: "verificationToken = :token",
      ExpressionAttributeValues: { ":token": token },
    }).promise();

    if (!user.Items || user.Items.length === 0) {
      return sendResponse(400, { success: false }, "Invalid or expired token."); 
    }

    const email = user.Items[0].email;

    await db.update({
      TableName: "agriaccount",
      Key: { email },
      UpdateExpression: "set verified = :verified remove verificationToken",
      ExpressionAttributeValues: {
        ":verified": true,
      },
    }).promise();

    return sendResponse(200, { success: true }, "Email verified successfully.");
  } catch (error) {
    console.error("Error verifying email:", error);
    return sendResponse(500, { success: false }, "Internal server error.");
  }
};


