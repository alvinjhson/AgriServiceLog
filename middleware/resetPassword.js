import jwt from "jsonwebtoken";

export const validateResetToken = async (token) => {
  try {
    if (!token) {
      throw new Error("Token is missing.");
    }

    const secret = process.env.RESET_TOKEN_SECRET || "yourResetTokenSecret";
    const decoded = jwt.verify(token, secret);

    if (!decoded.email) {
      throw new Error("Invalid token payload.");
    }

    return { success: true, user: { email: decoded.email } };
  } catch (error) {
    console.error("Reset token validation error:", error.message);
    return { success: false, message: "Invalid or expired reset token." };
  }
};
