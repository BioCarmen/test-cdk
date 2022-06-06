var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/lambda/github-handler.ts
var github_handler_exports = {};
__export(github_handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(github_handler_exports);
var AWS = __toESM(require("aws-sdk"));
var handler = async (event) => {
  console.log(event);
  const region = event.region;
  const pipelineName = event.detail.pipeline;
  const executionId = event.detail["execution-id"];
  const state = transformState(event.detail.state);
  if (state === null) {
    return;
  }
  const result = await getPipelineExecution(pipelineName, executionId);
  console.log(result);
  console.log(pipelineName, executionId);
  const payload = createPayload(pipelineName, region, state);
  if (!result) {
    console.error(`Can not resolve pipeline execution`);
    return;
  }
  console.log(`Successfully notified GitHub repository ${result.owner}/${result.repository} for commit ${result.sha} with payload:`, payload);
};
var getPipelineExecution = async (pipelineName, executionId) => {
  var _a, _b, _c;
  const params = {
    pipelineName,
    pipelineExecutionId: executionId
  };
  const result = await new AWS.CodePipeline().getPipelineExecution(params).promise();
  const artifactRevision = (_b = (_a = result == null ? void 0 : result.pipelineExecution) == null ? void 0 : _a.artifactRevisions) == null ? void 0 : _b.find(() => true);
  console.log(result);
  console.log((_c = result == null ? void 0 : result.pipelineExecution) == null ? void 0 : _c.artifactRevisions);
  const revisionURL = artifactRevision == null ? void 0 : artifactRevision.revisionUrl;
  const sha = artifactRevision == null ? void 0 : artifactRevision.revisionId;
  if (!revisionURL || !sha) {
    console.error("No revision URL or commit hash resolved");
    return;
  }
  const pattern = /github.com\/(.+)\/(.+)\/commit\//;
  const matches = pattern.exec(revisionURL);
  console.log(matches);
  return {
    owner: matches == null ? void 0 : matches[1],
    repository: matches == null ? void 0 : matches[2],
    sha
  };
};
function transformState(state) {
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
function createPayload(pipelineName, region, status) {
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
    description,
    context: `ci/${pipelineName}/${region}`
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
