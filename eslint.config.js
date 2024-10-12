import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["server/**/*.js"],
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
];
