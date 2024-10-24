import fs from "fs";

// Returns the relative path of a file from a base path.
function joinPaths(...paths: string[]): string {
  return paths.join("/");
}

// Creates a directory if it does not exist.
function makeDirIfNotExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export { joinPaths, makeDirIfNotExists };
