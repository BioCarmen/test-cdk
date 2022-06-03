import {
  CfnOutput,
  Stage,
  StageProps,
  Construct,
  Stack,
  StackProps,
} from "@aws-cdk/core";
import { Function, InlineCode, Runtime, Code } from "@aws-cdk/aws-lambda";
import * as path from "path";

export class MyLambdaStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    stageName: string,
    props?: StackProps
  ) {
    super(scope, id, props);
    new Function(this, "LambdaFunction", {
      runtime: Runtime.NODEJS_14_X, //using node for this, but can easily use python or other
      handler: "handler.handler",
      code: Code.fromAsset(path.join(__dirname, "lambda")), //resolving to ./lambda directory
      environment: { stageName: stageName }, //inputting stagename
    });
  }
}
