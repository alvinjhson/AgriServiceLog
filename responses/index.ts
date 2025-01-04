export function sendResponse(
    code: number, 
    response: object, 
    message: string 
  ): {
    statusCode: number;
    headers: { "Content-Type": string };
    body: string;
  } {
    return {
      statusCode: code,
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        ...response,
        message,
      }),
    };
  }
  