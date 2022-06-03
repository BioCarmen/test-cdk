export const handler = async (event: any) => {
  console.log(event);
  //   const region = event.region;
  //   const pipelineName = event.detail.pipeline;
  //   const executionId = event.detail["execution-id"];
  //   const state = transformState(event.detail.state);

  //   if (state === null) {
  //     return;
  //   }

  //   const result = await getPipelineExecution(pipelineName, executionId);
  //   const payload = createPayload(pipelineName, region, state);

  //   if (!result) {
  //     console.error(`Can not resolve pipeline execution`);
  //     return;
  //   }

  //   await postStatusToGitHub(
  //     result.owner,
  //     result.repository,
  //     result.sha,
  //     payload
  //   );

  //   console.log(
  //     `Successfully notified GitHub repository ${result.owner}/${result.repository} for commit ${result.sha} with payload:`,
  //     payload
  //   );
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

// const getPipelineExecution = async (pipelineName: string, executionId: string) => {
//     const params = {
//         pipelineName: pipelineName,
//         pipelineExecutionId: executionId
//     };

//     const result = await new CodePipeline().getPipelineExecution(params).promise();
//     const artifactRevision = result?.pipelineExecution?.artifactRevisions?.find(() => true);

//     const revisionURL = artifactRevision?.revisionUrl;
//     const sha = artifactRevision?.revisionId;

//     if (!revisionURL || !sha) {
//         console.error('No revision URL or commit hash resolved');
//         return;
//     }

//     const pattern = /github.com\/(.+)\/(.+)\/commit\//;
//     const matches = pattern.exec(revisionURL);

//     return {
//         owner: matches?.[1],
//         repository: matches?.[2],
//         sha: sha
//     };
// };
