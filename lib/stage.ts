import { CfnOutput, Stage, StageProps, Construct } from "@aws-cdk/core";

import { MyLambdaStack } from "./lambda-stack";

export class MyPipelineAppStage extends Stage {
  constructor(scope: Construct, stageName: string, props?: StageProps) {
    super(scope, stageName, props);

    const lambdaStack = new MyLambdaStack(this, "LambdaStack", stageName);
  }
}
