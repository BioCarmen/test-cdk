import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import {
  CodeStarConnectionsSourceAction,
  ManualApprovalAction,
} from "@aws-cdk/aws-codepipeline-actions";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";

import { ShellScriptAction } from "@aws-cdk/pipelines";

import { MyPipelineAppStage } from "./stage";
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import { CodePipelinePostToGitHub } from "./github-lambda-stack";
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
    // Use this code snippet in your app.
    // If you need more information about configurations or implementing the sample code, visit the AWS docs:
    // https://aws.amazon.com/developers/getting-started/nodejs/

    // Load the AWS SDK
    var AWS = require("aws-sdk"),
      region = "us-east-1",
      secretName =
        "arn:aws:secretsmanager:us-east-1:355621124855:secret:github-token-b7BN8L",
      secret: any,
      decodedBinarySecret;

    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
      region: region,
    });

    // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    // We rethrow the exception by default.

    client.getSecretValue({ SecretId: secretName }, (err: any, data: any) => {
      if (err) {
        if (err.code === "DecryptionFailureException")
          // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === "InternalServiceErrorException")
          // An error occurred on the server side.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === "InvalidParameterException")
          // You provided an invalid value for a parameter.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === "InvalidRequestException")
          // You provided a parameter value that is not valid for the current state of the resource.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === "ResourceNotFoundException")
          // We can't find the resource that you asked for.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
      } else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ("SecretString" in data) {
          secret = data.SecretString;
        } else {
          let buff = new Buffer(data.SecretBinary, "base64");
          decodedBinarySecret = buff.toString("ascii");
        }
      }

      // Your code goes here.
      const preprod = new MyPipelineAppStage(this, "test", {
        env: { account: "355621124855", region: "us-east-1" },
      });
      pipeline.addApplicationStage(preprod);

      new CodePipelinePostToGitHub(this, "CodePipelinePostToGithub", {
        pipeline: pipeline.codePipeline,
        githubToken: secret,
      });
    });

    // const stage = pipeline.addStage("Approval");

    // stage.addActions(
    //   new ManualApprovalAction({
    //     actionName: "Approval",
    //     runOrder: 1,
    //   })
    // );
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
