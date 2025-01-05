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
        "Access-Control-Allow-Origin": "http://localhost:5173", // Allow all origins for development; replace with your frontend URL in production
        "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow POST and OPTIONS methods
        "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
      },
      body: JSON.stringify({
        ...response,
        message,
      }),
    };
  }
  