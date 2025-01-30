import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config(); 

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
    try {
     
        const userId = event.queryStringParameters?.userId;

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "UserId is required" }),
            };
        }

        const MACHINE_TABLE = process.env.AWS_USER_MACHINES_TABLE;
        if (!MACHINE_TABLE) {
            throw new Error("Environment variable AWS_USER_MACHINES_TABLE is not set");
        }

       
        const result = await db
            .query({
                TableName: MACHINE_TABLE,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": userId, 
                },
            })
            .promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                machines: result.Items || [],
            }),
        };
    } catch (error) {
        console.error("Error fetching user machines:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "Failed to fetch machines" }),
        };
    }
};
