import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },

  {
    files: ["**/*.json"],
    // 1. DÜZELTME: Normal JSON bloğuna "ignores" satırını ekleyip tsconfig ve package-lock'u dışlıyoruz.
    ignores: ["package-lock.json", "**/tsconfig*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"]
  },

  // 2. DÜZELTME: tsconfig dosyaları için özel JSONC (Yorumlu JSON) bloğunu ekliyoruz.
  {
    files: ["**/tsconfig*.json"],
    plugins: { json },
    language: "json/jsonc",
    languageOptions: { allowTrailingCommas: true }
  },

  {
    files: ["**/package-lock.json"],
    rules: {
      "json/no-empty-keys": "off"
    }
  },

  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"]
  },
  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
    extends: ["json/recommended"]
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"]
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"]
  }
]);