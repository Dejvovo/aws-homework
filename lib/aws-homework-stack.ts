import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import path from "path";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { handler as startGameHandler } from "../lambda/startGame";
import { handler as guessHandler } from "../lambda/guess";

export class AwsHomeworkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda functions
    const startGameLambda = new NodejsFunction(this, "StartGameLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: startGameHandler.name,
      entry: path.join(__dirname, "../lambda/startGame.ts"),
    });

    const guessLambda = new NodejsFunction(this, "GuessLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: guessHandler.name,
      entry: path.join(__dirname, "../lambda/guess.ts"),
    });

    // API gateway
    const apiGateway = new apigateway.RestApi(this, "ApiGateway");

    // REST endpoints
    const startGameRoute = apiGateway.root.addResource("start-game");
    const guessRoute = apiGateway.root.addResource("guess");

    // Bootstrap lambda functions and endpoints
    startGameRoute.addMethod(
      "POST",
      new apigateway.LambdaIntegration(startGameLambda)
    );

    guessRoute.addMethod("POST", new apigateway.LambdaIntegration(guessLambda));

    // Database
    const table = new dynamodb.Table(this, "Database", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // DEFAULT is PROVISIONED. But this is easier to setup.
      removalPolicy: cdk.RemovalPolicy.DESTROY, // DEFAULT is RETAIN. But for such small project i want the DB to be deleted after stack removal.
    });

    // Provide environment variables
    startGameLambda.addEnvironment("TABLE_NAME", table.tableName);
    guessLambda.addEnvironment("TABLE_NAME", table.tableName);

    // Grant permissions to lambda function.
    table.grantReadWriteData(startGameLambda);
    table.grantReadWriteData(guessLambda);
  }
}
