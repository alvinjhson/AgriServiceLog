import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const { userId, userMachineId, lastService } = JSON.parse(event.body); 

    if (!userId || !userMachineId || !lastService) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing required fields." }),
      };
    }

    await db
      .update({
        TableName: "userMachines",
        Key: { userMachineId }, 
        UpdateExpression: "set lastService = :lastService",
        ExpressionAttributeValues: {
          ":lastService": lastService,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Last service date updated successfully." }),
    };
  } catch (error) {
    console.error("Error updating service date:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Failed to update last service date." }),
    };
  }
};
