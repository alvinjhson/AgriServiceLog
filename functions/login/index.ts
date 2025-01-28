import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResponse } from "../../responses";

const db = new AWS.DynamoDB.DocumentClient();

interface User {
  userId: string;
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  userId?: string; 
}

async function getUserByEmail(email: string): Promise<User | false> {
  try {
    
    const user = await db
      .get({
        TableName: "agriaccount",
        Key: {
          email, 
        },
      })
      .promise();

    return user.Item ? (user.Item as User) : false;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return false;
  }
}

async function getUserByResetToken(resetToken: string): Promise<User | false> {
  try {
    
    const user = await db
      .query({
        TableName: "agriaccount",
        IndexName: "ResetTokenIndex", 
        KeyConditionExpression: "resetToken = :resetToken",
        ExpressionAttributeValues: {
          ":resetToken": resetToken,
        },
      })
      .promise();

    return user.Items && user.Items[0] ? (user.Items[0] as User) : false;
  } catch (error) {
    console.error("Error fetching user by reset token:", error);
    return false;
  }
}

async function login(identifier: string, password: string): Promise<LoginResponse> {
  let user: User | false;

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

  if (isEmail) {
    user = await getUserByEmail(identifier);
  } else {
    console.error("Only email-based logins are supported.");
    return { success: false, message: "Invalid login identifier. Use email." };
  }

  if (!user) {
    return { success: false, message: "Incorrect email or password." };
  }

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    return { success: false, message: "Incorrect email or password." };
  }

  const token = jwt.sign(
    { id: user.userId, username: user.username, email: user.email },
    process.env.JWT_SECRET || "aabbcc",
    { expiresIn: 3600 } 
  );

  return { success: true, token, userId: user.userId }; 
}


export const handler = async (event: { body: string }) => {
  try {
    const { identifier, password } = JSON.parse(event.body);

    if (!identifier || !password) {
      return sendResponse(
        400,
        { success: false },
        "Email and password are required."
      );
    }

    const result = await login(identifier, password);

    if (result.success) {
      return sendResponse(200, result, "Account logged in");
    } else {
      return sendResponse(400, result, "Incorrect email or password");
    }
  } catch (error) {
    console.error("Error handling login request:", error);
    return sendResponse(500, { success: false }, "Internal server error");
  }
};

