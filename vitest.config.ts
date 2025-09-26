import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom", // simulates a browser
    globals: true, // optional: use describe/it/expect globally
    setupFiles: "./vitest.setup.ts", // optional
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
  },
});
