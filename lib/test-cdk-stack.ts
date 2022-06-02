import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from "./cdkpipelines-demo-stage";
import { ShellScriptAction } from "@aws-cdk/pipelines";
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
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: "GitHub",
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager("github-token"),
        owner: "BioCarmen",
        repo: "demo-api",
        branch: "master",
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,

        // We need a build step to compile the TypeScript Lambda
        buildCommand: "npm run build",
      }),
    });
    // const testingStage = pipeline.addStage(
    //   new MyPipelineAppStage(this, "test", {
    //     env: { account: "355621124855", region: "us-east-1" },
    //   })
    // );

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
