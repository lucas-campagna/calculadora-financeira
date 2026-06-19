import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import { svelteTesting } from "@testing-library/svelte/vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), svelteTesting()],
  ssr: { noExternal: ["chart.js"] },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
