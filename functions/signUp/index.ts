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
  verificationToken: string;
  verified: boolean;
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
  verificationToken,
  verified,
}: CreateAccountInput): Promise<CreateAccountResult> {
  try {
    await db
      .put({
        TableName: "agriaccount",
        Item: {
          username,
          password: hashedPassword,
          firstname,
          lastname,
          email,
          userId,
          verificationToken,
          verified,
        },
      })
      .promise();

    return { success: true, userId };
  } catch (error) {
    console.error("Error creating account:", error);
    return { success: false, message: "Could not create account" };
  }
}

async function sendVerificationEmail(email: string, verificationToken: string) {
  const AWS = require("aws-sdk");
  const ses = new AWS.SES();

  const verificationLink = `https://z09zwi52qg.execute-api.eu-north-1.amazonaws.com/auth/verify-email?token=${verificationToken}`;
  const params = {
    Source: "jhsonagri@gmail.com", // Replace with a verified sender email
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: { Data: "Verify Your Email Address" },
      Body: {
        Text: {
          Data: `Please verify your email address by clicking the following link: ${verificationLink}`,
        },
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
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
  const verificationToken = nanoid(); // Generate unique token for verification
  const verified = false; // New accounts are unverified by default

  const accountResult = await createAccount({
    username,
    hashedPassword,
    userId,
    firstname,
    lastname,
    email,
    verificationToken,
    verified,
  });

  if (accountResult.success) {
    try {
      // Send verification email
      await sendVerificationEmail(email, verificationToken);
      return { success: true, userId, message: "Account created. Verification email sent." };
    } catch (error) {
      return { success: false, message: "Account created but failed to send verification email." };
    }
  } else {
    return { success: false, message: accountResult.message || "Could not create account" };
  }
}

export const handler = async (event: { body: string }) => {
  try {
    const { username, password, firstname, lastname, email } = JSON.parse(event.body);

    if (!username || !password || !firstname || !lastname || !email) {
      return sendResponse(400, { success: false }, "All fields are required");
    }

    const result = await signup(username, password, firstname, lastname, email);

    if (result.success) {
      return sendResponse(200, result, "Account Created");
    } else {
      return sendResponse(400, result, result.message || "Could not create account");
    }
  } catch (error) {
    console.error("Error handling signup:", error);
    return sendResponse(500, { success: false }, "Internal Server Error");
  }
};

