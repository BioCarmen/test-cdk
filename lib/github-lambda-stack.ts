import { Construct, Duration } from "@aws-cdk/core";
import { IPipeline, Pipeline } from "@aws-cdk/aws-codepipeline";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { IStringParameter } from "@aws-cdk/aws-ssm";
import * as path from "path";
import { CdkPipeline } from "@aws-cdk/pipelines";
import { SecretValue } from "aws-cdk-lib";

export class CodePipelinePostToGitHub extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      pipeline: Pipeline;
      githubToken: string;
    }
  ) {
    super(scope, id);

    // const lambda = new Function(this, "Function", {
    //   code: Code.fromAsset(path.resolve(__dirname, "lambda"), {}),
    //   handler: "github-handler.handler",
    //   timeout: Duration.seconds(30),
    //   logRetention: RetentionDays.ONE_MONTH,
    //   runtime: Runtime.NODEJS_14_X,
    // });

    // // Allow the Lambda to query CodePipeline for more details on the build that triggered the event
    // lambda.addToRolePolicy(
    //   new PolicyStatement({
    //     actions: ["codepipeline:GetPipelineExecution"],
    //     resources: [this.props.pipeline],
    //   })
    // );
    console.log(this.props.githubToken);
    // Allow the Lambda to post to a private GitHub API on behalf of the repo owner
    // lambda.addEnvironment("ACCESS_TOKEN", this.props.githubToken);

    // this.props.pipeline.onStateChange("onStateChange", {
    //   target: new LambdaFunction(lambda),
    // });
  }
}
