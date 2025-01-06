export function sendResponse(
    code: number,
    response: object,
    message: string
  ): {
    statusCode: number;
    headers: {
      "Content-Type": string;
      "Access-Control-Allow-Origin": string;
      "Access-Control-Allow-Methods": string;
      "Access-Control-Allow-Headers": string;
    };
    body: string;
  } {
    return {
      statusCode: code,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173", 
        "Access-Control-Allow-Methods": "POST, OPTIONS", 
        "Access-Control-Allow-Headers": "Content-Type", 
      },
      body: JSON.stringify({
        ...response,
        message,
      }),
    };
  }
  