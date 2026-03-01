export const error = (message: string) => ({
  statusCode: 500,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ error: message }),
});

export const success = <T>(content: T) => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(content),
});
