// prettier.config.js

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindAttributes: ["className"],
  tailwindStylesheet: "./src/app/globals.css",
  printWidth: 100,
  tabWidth: 2,
};
