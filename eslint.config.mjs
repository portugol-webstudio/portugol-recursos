import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import unicorn from "eslint-plugin-unicorn";

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  eslint.configs.recommended,
  unicorn.configs.all,
  prettier,
  {
    ignores: ["node_modules/", "lib/", "ajuda/", "exemplos/", "exercicios/"],
  },
  {
    rules: {
      "unicorn/max-nested-calls": "off",
      "unicorn/no-asterisk-prefix-in-documentation-comments": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
];
