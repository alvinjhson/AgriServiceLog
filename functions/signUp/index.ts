import { nanoid } from "nanoid";
import { sendResponse } from "../../responses";
import bcrypt from "bcryptjs";
import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();

interface CreateAccountInput {
  username: string;
  hashedPassword: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface CreateAccountResult {
  success: boolean;
  userId?: string;
  message?: string;
}

interface SignupResult {
  success: boolean;
  message?: string;
  userId?: string;
}

async function createAccount({
  username,
  hashedPassword,
  userId,
  firstname,
  lastname,
  email,
}: CreateAccountInput): Promise<CreateAccountResult> {
  try {
    await db
      .put({
        TableName: "account",
        Item: {
          username,
          password: hashedPassword,
          firstname,
          lastname,
          email, 
          userId,
        },
      })
      .promise();

    return { success: true, userId };
  } catch (error) {
    console.error("Error creating account:", error);
    return { success: false, message: "Could not create account" };
  }
}

async function signup(
  username: string,
  password: string,
  firstname: string,
  lastname: string,
  email: string
): Promise<SignupResult> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = nanoid();

  const result = await createAccount({
    username,
    hashedPassword,
    userId,
    firstname,
    lastname,
    email, 
  });

  return result;
}

export const handler = async (event: { body: string }) => {
  try {
    const { username, password, firstname, lastname, email } = JSON.parse(
      event.body
    );

   
    if (!username || !password || !firstname || !lastname || !email) {
      return sendResponse(400, { success: false }, "All fields are required");
    }

    const result = await signup(username, password, firstname, lastname, email);

    if (result.success) {
      return sendResponse(200, result, "Account Created");
    } else {
      return sendResponse(400, result, "Could not create account");
    }
  } catch (error) {
    console.error("Error handling signup:", error);
    return sendResponse(500, { success: false }, "Internal Server Error");
  }
};
