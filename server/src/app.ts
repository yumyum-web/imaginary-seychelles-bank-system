import express from "express";
import { initialize } from "express-openapi";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import v1ApiDoc from "./api/v1/api-doc.js";
import { joinPaths, makeDirIfNotExists } from "./utils.js";
import { paths } from "./config.js";

const pathsDir = joinPaths(paths.srcDir, "api", "v1", "paths");
makeDirIfNotExists(pathsDir);

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

await initialize({
  app,
  apiDoc: v1ApiDoc,
  dependencies: {},
  paths: pathsDir,
});

export default app;
