import { error, success } from "../../lib/utils/responseUtils";

describe("response helpers", () => {
  test("error returns 500 with JSON string body", () => {
    const message = "Something went wrong";

    const result = error(message);

    expect(result.statusCode).toBe(500);
    expect(result.headers).toEqual({
      "Content-Type": "application/json",
    });

    expect(result.body).toBe(JSON.stringify(message));
  });

  test("success returns 200 with JSON string body", () => {
    const payload = { gameId: 1, message: "OK" };

    const result = success(payload);

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({
      "Content-Type": "application/json",
    });

    expect(result.body).toBe(JSON.stringify(payload));
  });

  test("success correctly stringifies primitives", () => {
    const result = success("hello");

    expect(result.body).toBe(JSON.stringify("hello"));
  });
});
