// import { Construct, Duration } from "@aws-cdk/core";
// import { IPipeline, Pipeline } from "@aws-cdk/aws-codepipeline";
// import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
// import { LambdaFunction } from "@aws-cdk/aws-events-targets";
// import { PolicyStatement } from "@aws-cdk/aws-iam";
// import { RetentionDays } from "@aws-cdk/aws-logs";
// import { IStringParameter } from "@aws-cdk/aws-ssm";
// import * as path from "path";
// import { CdkPipeline } from "@aws-cdk/pipelines";
// import { SecretValue, Stack } from "aws-cdk-lib";

// export class CodePipelinePostToGitHub extends Stack {
//   constructor(
//     scope: Construct,
//     id: string,
//     private props?: {
//       pipeline: Pipeline;
//       githubToken: string;
//     }
//   ) {
//     super(scope, id);
//     console.log("in the pipeline");
//     new Function(this, "Function", {
//       runtime: Runtime.NODEJS_14_X, //using node for this, but can easily use python or other
//       handler: "handler.handler",
//       code: Code.fromAsset(path.join(__dirname, "lambda")), //resolving to ./lambda directory
//     });

//     // // Allow the Lambda to query CodePipeline for more details on the build that triggered the event
//     // lambda.addToRolePolicy(
//     //   new PolicyStatement({
//     //     actions: ["codepipeline:GetPipelineExecution"],
//     //     resources: [this.props.pipeline],
//     //   })
//     // );

//     // Allow the Lambda to post to a private GitHub API on behalf of the repo owner
//     // lambda.addEnvironment("ACCESS_TOKEN", this.props.githubToken);

//     // this.props.pipeline.onStateChange("onStateChange", {
//     //   target: new LambdaFunction(lambda),
//     // });
//   }
// }
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

export class CodePipelinePostToGitHub extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new Function(this, "LambdaFunction", {
      runtime: Runtime.NODEJS_14_X, //using node for this, but can easily use python or other
      handler: "github-handler.handler",
      code: Code.fromAsset(path.join(__dirname, "lambda")), //resolving to ./lambda directory
    });
  }
}
