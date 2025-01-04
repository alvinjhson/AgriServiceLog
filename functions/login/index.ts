import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResponse } from "../../responses";

const db = new AWS.DynamoDB.DocumentClient();

interface User {
  userId: string;
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}


async function getUser(username: string): Promise<User | false> {
  try {
    const user = await db
      .get({
        TableName: "account",
        Key: {
          username,
        },
      })
      .promise();

    return user?.Item as User || false;
  } catch (error) {
    console.error("Error fetching user:", error);
    return false;
  }
}


async function login(username: string, password: string): Promise<LoginResponse> {
  const user = await getUser(username);

  if (!user) {
    return { success: false, message: "Incorrect username or password" };
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return { success: false, message: "Incorrect username or password" };
  }

  const token = jwt.sign(
    { id: user.userId, username: user.username },
    process.env.JWT_SECRET || "aabbcc",
    { expiresIn: 3600 }
  );

  return { success: true, token };
}


export const handler = async (event: { body: string }) => {
  try {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return sendResponse(400, { success: false },"Username and password are required.");
    }

    const result = await login(username, password);

    if (result.success) {
      return sendResponse(200, result, "Account logged in");
    } else {
      return sendResponse(400, result, "Username or password is incorrect");
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return sendResponse(500, { success: false }, "Internal server error");
  }
};
