// import { CfnOutput, Stage, StageProps, Construct } from "@aws-cdk/core";
// import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
// import { CodePipelinePostToGitHub } from "./github-lambda-stack";

// export class CodePipelinePostToGitHubStage extends Stage {
//   constructor(scope: Construct, stageName: string, props?: StageProps) {
//     super(scope, stageName, props);
//     const secret = secretsmanager.Secret.fromSecretNameV2(
//       this,
//       "arn:aws:secretsmanager:us-east-1:355621124855:secret:github-token-b7BN8L",
//       "github-token"
//     ).toString();
//     const CodePipelinePostToGitHubStack = new CodePipelinePostToGitHub(
//       this,
//       "CodePipelinePostToGitHubStack",
//       {
//         githubToken: secret,
//         sha: "1231",
//       }
//     );
//   }
// }
