import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getItem } from "../lib/utils/dbUtils";
import { error, success } from "../lib/utils/responseUtils";

interface IRequestBody {
  gameId: number;
  guess: number;
}

const isValidGameId = (gameId: string) => Number.isInteger(Number(gameId));

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const getPostRequestInput = (
  body: string | null | undefined
): IRequestBody | string => {
  if (!body) return "No body found in the request";

  try {
    const parsedBody = JSON.parse(body);
    if (
      typeof parsedBody?.gameId === "string" && // No need for sql injection escaping. We are not using an sql databse.
      typeof parsedBody?.guess === "number" &&
      isValidGameId(parsedBody.gameId)
    ) {
      return { gameId: parsedBody.gameId, guess: parsedBody.guess };
    }
    return "Could not parse safely request body. GameId should be of type string and withing range 1-100. Guess should be of type number.";
  } catch (err) {
    return `Something bad happenned when parsing the input string. Err: ${JSON.stringify(
      err
    )}`;
  }
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const input = getPostRequestInput(event.body);
  if (typeof input === "string") {
    return error(input);
  }

  const tableName = process.env.TABLE_NAME;
  if (!tableName) {
    return error("Environment variable TABLE_NAME was not set properly");
  }

  const item = await getItem(tableName, client, input.gameId);
  if (!item) {
    return error("Invalid game ID. Such game does not exists in the database.");
  }

  if (input.guess < item.numberToGuess) {
    return success({ message: "Too low. Try again!" });
  }

  if (input.guess > item.numberToGuess) {
    return success({ message: "Too high. Try again!" });
  }

  return success({ message: "Correct! You've guessed the number." });
};
