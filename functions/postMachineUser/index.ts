import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const { userId, machineId } = JSON.parse(event.body);

    if (!userId || !machineId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "UserId and MachineId are required." }),
      };
    }

    const timestamp = new Date().toISOString();

    await db
      .put({
        TableName: "userMachines",
        Item: { userId, machineId, timestamp },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Machine added successfully.",
        data: { userId, machineId, timestamp },
      }),
    };
  } catch (error) {
    console.error("Error adding machine to user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Failed to add machine." }),
    };
  }
};
