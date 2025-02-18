import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import unicorn from "eslint-plugin-unicorn";

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  unicorn.configs.all,
  prettier,
  {
    ignores: ["node_modules/", "lib/", "ajuda/", "exemplos/", "exercicios/"],
  },
  {
    rules: {
      "unicorn/prevent-abbreviations": "off",
    },
  },
];
