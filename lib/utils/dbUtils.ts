import { ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { IDatabaseItem } from "../types";

export const getItems = async (
  tableName: string,
  database: DynamoDBDocumentClient
): Promise<IDatabaseItem[]> => {
  const result = await database.send(new ScanCommand({ TableName: tableName }));
  return ((result as any).Items ?? []) as IDatabaseItem[]; // TODO TS chyba, proc?
};

export const getItem = async (
  tableName: string,
  database: DynamoDBDocumentClient,
  pk: number
): Promise<IDatabaseItem | undefined> => {
  const result = await database.send(
    new GetCommand({
      TableName: tableName,
      Key: { pk },
    })
  );

  return (result as any).Item as IDatabaseItem | undefined;
};

export const storeItem = async (
  tableName: string,
  database: DynamoDBDocumentClient,
  item: IDatabaseItem
): Promise<void> => {
  await database.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    })
  );
};
