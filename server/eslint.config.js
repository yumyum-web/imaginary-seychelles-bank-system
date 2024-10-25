import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [pluginJs.configs.recommended, ...tseslint.configs.recommended],
  files: ["src/**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2023,
    globals: globals.node,
  },
});
