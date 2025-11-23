import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { beforeAll } from "vitest";
import * as preview from "./preview";

const project = setProjectAnnotations([preview]);

beforeAll(project.beforeAll);
