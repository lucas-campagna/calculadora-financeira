import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const dev = process.argv.includes("dev");

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "index.html",
      precompress: true,
      strict: false,
    }),
    paths: {
      base:
        process.env.SVELTE_BASE_PATH ?? (dev ? "" : "/calculadora-financeira"),
    },
  },
};

export default config;
