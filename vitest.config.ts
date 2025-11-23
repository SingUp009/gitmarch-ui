/// <reference types="vitest" />

import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { storybookNextJsPlugin } from "@storybook/nextjs-vite/vite-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths(), react(), storybookNextJsPlugin()],
  optimizeDeps: {
    include: [
      "@testing-library/react",
      "@testing-library/jest-dom/vitest",
      "@storybook/nextjs-vite",
      "next/router",
      "next/navigation",
      "next-router-mock",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
  test: {
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: [...configDefaults.exclude, "e2e/**", "playwright/**"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: [
            "src/**/*.{ui,browser}.test.{ts,tsx}",
            "src/**/*.stories.*",
          ],
        },
      },
      {
        extends: true,
        test: {
          name: "ui",
          browser: {
            enabled: true,
            provider: playwright(),
            headless: process.env.CI === "true",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: ["./vitest.setup.ts", ".storybook/vitest.setup.ts"],
          include: ["src/**/*.{ui,browser}.test.{ts,tsx}"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
