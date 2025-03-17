import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {


    if (!event.body) {
      console.error(" Missing request body.");
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing request body." }),
      };
    }

  
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      console.error("Error parsing JSON body:", error);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Invalid JSON format." }),
      };
    }

    const { userId, userMachineId, lastService } = parsedBody;

    
    if (!userId || !userMachineId || !lastService) {
      console.error(" Missing required fields:", { userId, userMachineId, lastService });
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing required fields." }),
      };
    }

  

    
    const params = {
      TableName: "userMachiness",
      Key: { userId, userMachineId }, 
      UpdateExpression: "SET lastService = :lastService",
      ExpressionAttributeValues: { ":lastService": lastService },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await db.update(params).promise();


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

