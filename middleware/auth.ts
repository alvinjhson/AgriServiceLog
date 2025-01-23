import jwt from "jsonwebtoken";
import { APIGatewayEvent } from "aws-lambda";

type Request = {
    event: APIGatewayEvent & {
        user?: {
            id: string;
            username: string;
        };
    };
};
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;
const jwtSecret = `${JWT_SECRET}`
 || "default-secret";
const validateToken = {
    before: async (request: Request): Promise<void> => {
        try {
            const token = request.event.headers?.authorization?.replace("Bearer ", "");

            if (!token) {
                throw new Error("Token is missing or malformed");
            }

            const data = jwt.verify(token, jwtSecret) as { id: string; username: string };

            request.event.user = {
                id: data.id,
                username: data.username,
            };
        } catch (error) {
            console.error("Token validation error:", (error as Error).message);
            throw new Error("Unauthorized");
        }
    },
};

export { validateToken };