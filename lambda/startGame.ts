import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { IDatabaseItem } from "../lib/types";
import { getItems, storeItem } from "../lib/utils/dbUtils";
import { error, success } from "../lib/utils/responseUtils";
import {
  generateNewUniqueId,
  now,
  generateNumberToGuess,
} from "../lib/utils/utils";

// Why not generate this array via for-loop? AWS bills per server usage and this should be lil bit faster.
const ALL_POSSIBLE_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  99, 100,
];

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandler = async () => {
  const tableName = process.env.TABLE_NAME;
  if (!tableName) {
    return error("Environment variable TABLE_NAME was not set properly");
  }

  const items = await getItems(tableName, client);
  const newUniqueId = generateNewUniqueId(
    items.map((item) => item.pk),
    ALL_POSSIBLE_IDS
  );
  if (!newUniqueId) {
    return error(
      "Maximum number of active games reached. Sorry, clear the database before proceeding."
    );
  }

  try {
    await storeItem(tableName, client, {
      pk: newUniqueId,
      sk: now(),
      numberToGuess: generateNumberToGuess(),
    } as IDatabaseItem);

    return success({
      gameId: newUniqueId,
      message: "Game started. Make a guess between 1 and 100.",
    });
  } catch (err) {
    return error(
      `Something bad happenned when tring to create a new game. More info: ${JSON.stringify(
        err
      )}`
    );
  }
};
