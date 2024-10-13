import express from "express";
import { initialize } from "express-openapi";

import v1ApiDoc from "./api/v1/api-doc.js";
import { joinPaths, makeDirIfNotExists } from "./utils.js";
import { paths } from "./config.js";

const pathsDir = joinPaths(paths.srcDir, "api", "v1", "paths");
makeDirIfNotExists(pathsDir);

const app = express();
initialize({
  app,
  apiDoc: v1ApiDoc,
  dependencies: {},
  paths: pathsDir,
});

export default app;
