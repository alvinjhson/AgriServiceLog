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
}

async function getUserByUsernameOrEmail(identifier: string): Promise<User | false> {
  try {
    
    const userByUsername = await db
      .get({
        TableName: "agriaccount",
        Key: {
          username: identifier,
        },
      })
      .promise();

    if (userByUsername.Item) {
      return userByUsername.Item as User;
    }

   
    const userByEmail = await db
      .query({
        TableName: "agriaccount",
        IndexName: "EmailIndex", 
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": identifier,
        },
      })
      .promise();

    return userByEmail.Items && userByEmail.Items[0]
      ? (userByEmail.Items[0] as User)
      : false;
  } catch (error) {
    console.error("Error fetching user:", error);
    return false;
  }
}

async function login(identifier: string, password: string): Promise<LoginResponse> {
  const user = await getUserByUsernameOrEmail(identifier);

  if (!user) {
    return { success: false, message: "Incorrect username, email, or password" };
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return { success: false, message: "Incorrect username, email, or password" };
  }

  const token = jwt.sign(
    { id: user.userId, username: user.username, email: user.email },
    process.env.JWT_SECRET || "aabbcc",
    { expiresIn: 3600 }
  );

  return { success: true, token };
}

export const handler = async (event: { body: string }) => {
  try {
    const { identifier, password } = JSON.parse(event.body);

    if (!identifier || !password) {
      return sendResponse(
        400,
        { success: false },
        "Identifier (username or email) and password are required."
      );
    }

    const result = await login(identifier, password);

    if (result.success) {
      return sendResponse(200, result, "Account logged in");
    } else {
      return sendResponse(400, result, "Incorrect username, email, or password");
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return sendResponse(500, { success: false }, "Internal server error");
  }
};
