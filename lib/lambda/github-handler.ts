import { CodePipeline } from "@aws-cdk/pipelines";
import fetch from "node-fetch";
import * as AWS from "aws-sdk";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
const getSecrets = async ({ secretName }: { secretName: string }) => {
  const client = new SecretsManager({ region: "us-east-1" });

  try {
    const data = await client.getSecretValue({ SecretId: secretName });

    if ("SecretString" in data) {
      const secret = data.SecretString!;

      return secret;
    }
  } catch (error) {
    console.error({
      message: `Unable to load secret key '${secretName}'`,
      details: (error as any).toString(),
    });
  }

  return {
    DIAGNOSTIC_API_KEY: "",
  };
};

export const handler = async (event: any) => {
  console.log(event);

  const region = event.region;
  const pipelineName = event.detail.pipeline;
  const executionId = event.detail["execution-id"];
  const state = transformState(event.detail.state);

  if (state === null) {
    return;
  }

  const result = await getPipelineExecution(pipelineName, executionId);
  console.log("get piplelineExecution", result);
  console.log(pipelineName, executionId);
  const payload = createPayload(pipelineName, region, state);

  if (!result) {
    console.error(`Can not resolve pipeline execution`);
    return;
  }

  const response = await postStatusToGitHub(
    result.owner,
    result.repository,
    result.sha,
    payload
  );
  console.log("post response", response);
  console.log(
    `Successfully notified GitHub repository ${result.owner}/${result.repository} for commit ${result.sha} with payload:`,
    payload
  );
};
const getPersonalAccessToken = async () => {
  const secrets = await getSecrets({ secretName: "github-token" });
  return secrets;
  throw new Error("process.env.ACCESS_TOKEN is not defined");
};

const getPipelineExecution = async (
  pipelineName: string,
  executionId: string
) => {
  const params = {
    pipelineName: pipelineName,
    pipelineExecutionId: executionId,
  };

  const result = await new AWS.CodePipeline()
    .getPipelineExecution(params)
    .promise();
  console.log("get result from execution", result);
  const artifactRevision = result?.pipelineExecution?.artifactRevisions?.find(
    () => true
  );
  console.log(result);
  console.log(result?.pipelineExecution?.artifactRevisions);
  const revisionURL = artifactRevision?.revisionUrl;
  const sha = artifactRevision?.revisionId;

  if (!revisionURL || !sha) {
    console.error("No revision URL or commit hash resolved");
    return;
  }

  const pattern = /github.com\/(.+)\/(.+)\/commit\//;
  const matches = pattern.exec(revisionURL);
  console.log(matches);
  return {
    owner: matches?.[1],
    repository: matches?.[2],
    sha: sha,
  };
};

function transformState(state: string) {
  if (state === "STARTED") {
    return "pending";
  }
  if (state === "SUCCEEDED") {
    return "success";
  }
  if (state === "FAILED") {
    return "failure";
  }

  return null;
}
function createPayload(pipelineName: string, region: string, status: string) {
  let description;
  if (status === "pending") {
    description = "Build started";
  } else if (status === "success") {
    description = "Build succeeded";
  } else if (status === "failure") {
    description = "Build failed!";
  }

  return {
    state: status,
    target_url: pipelineName,
    description: description,
    context: `ci/${pipelineName}/${region}`,
  };
}

const postStatusToGitHub = async (
  owner?: string | undefined,
  repository?: string | undefined,
  sha?: any,
  payload?: any
) => {
  const url = `https://api.github.com/repos/BioCarmen/test-cdk/deployments`;
  //   const url = `/${owner}/${repository}/statuses/${sha}`;
  //   const _payload = {
  //     payload: "ok",
  //     ref: "8975f5baa9dfbd75eaf40310c1d7b7bbf733ccf6",
  //   };
  const _payload = { payload: "ok", ref: sha };
  const token = await getPersonalAccessToken();
  console.log("token", token);
  console.log(_payload, sha);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      body: _payload
        ? JSON.stringify(_payload)
        : JSON.stringify({ ...payload }),
    });
    const responseJson = await response.json();
    console.log(responseJson);
    const deploymentUrl = `${(responseJson as any).url}/statuses`;

    // deployment status
    const deploymentStatus = await fetch(deploymentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      body: JSON.stringify({ environment: "production", state: "success" }),
    });
    const deploymentStatusJson = await deploymentStatus.json();
    console.log("deployment status", deploymentStatus, deploymentStatusJson);
  } catch (error) {
    console.log(error);
  }
};
