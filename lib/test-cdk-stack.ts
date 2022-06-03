import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import {
  CodeStarConnectionsSourceAction,
  ManualApprovalAction,
} from "@aws-cdk/aws-codepipeline-actions";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";

import { ShellScriptAction } from "@aws-cdk/pipelines";
import { CodePipelinePostToGitHub } from "./github-lambda-stack";
import { MyPipelineAppStage } from "./stage";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TestCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, "Pipeline", {
      // The pipeline name
      pipelineName: "MyServicePipeline",
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new CodeStarConnectionsSourceAction({
        actionName: "GitHub",
        output: sourceArtifact,
        connectionArn:
          "arn:aws:codestar-connections:us-east-1:355621124855:connection/db98cb5e-3357-4118-a0ad-b2c3c7453e03",
        owner: "BioCarmen",
        repo: "test-cdk",
        branch: "main",
        triggerOnPush: true,
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,

        // We need a build step to compile the TypeScript Lambda
        buildCommand: "npm run build",
      }),
    });
    new CodePipelinePostToGitHub(this, "CodePipelinePostToGithub", {
      pipeline: pipeline.codePipeline,
      githubToken: SecretValue.secretsManager("github-token").toString(),
    });
    const preprod = new MyPipelineAppStage(this, "test", {
      env: { account: "355621124855", region: "us-east-1" },
    });
    pipeline.addApplicationStage(preprod);

    const stage = pipeline.addStage("Approval");

    stage.addActions(
      new ManualApprovalAction({
        actionName: "Approval",
        runOrder: 1,
      })
    );
    // const testingStage = pipeline.addStage(
    //   new MyPipelineAppStage(this, "test", {
    //     env: { account: "355621124855", region: "us-east-1" },
    //   })
    // );
    const postprod = new MyPipelineAppStage(this, "prod", {
      env: { account: "355621124855", region: "us-east-1" },
    });
    // testingStage.addPre(
    //   new ShellStep("Run Unit Tests", { commands: ["npm install", "npm test"] })
    // );
    // testingStage.addPost(
    //   new ManualApprovalStep("Manual approval before production")
    // );

    // const prodStage = pipeline.addStage(
    //   new MyPipelineAppStage(this, "prod", {
    //     env: { account: "355621124855", region: "us-east-1" },
    //   })
    // );
  }
}
