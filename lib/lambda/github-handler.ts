import { CodePipeline } from "@aws-cdk/pipelines";
import fetch from "node-fetch";
import * as AWS from "aws-sdk";
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

  await postStatusToGitHub(
    result.owner,
    result.repository,
    result.sha,
    payload
  );

  console.log(
    `Successfully notified GitHub repository ${result.owner}/${result.repository} for commit ${result.sha} with payload:`,
    payload
  );
};
const getPersonalAccessToken = () => {
  if (process.env.ACCESS_TOKEN) {
    return process.env.ACCESS_TOKEN as string;
  }
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
  owner: string | undefined,
  repository: string | undefined,
  sha: any,
  payload: any
) => {
  const url = `https://api.github.com/repos/BioCarmen/test-cdk/deployments`;
  //   const url = `/${owner}/${repository}/statuses/${sha}`;
  const _payload = { ...payload, ref: sha };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${getPersonalAccessToken()}`,
    },
    body: _payload,
  });
};
