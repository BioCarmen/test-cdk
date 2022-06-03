import { CfnOutput, Stage, StageProps, Construct } from "@aws-cdk/core";

import { CodePipelinePostToGitHub } from "./github-lambda-stack";

export class CodePipelinePostToGitHubStage extends Stage {
  constructor(scope: Construct, stageName: string, props?: StageProps) {
    super(scope, stageName, props);

    const CodePipelinePostToGitHubStack = new CodePipelinePostToGitHub(
      this,
      "CodePipelinePostToGitHubStack"
    );
  }
}
