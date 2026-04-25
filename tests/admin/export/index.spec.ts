import test from "playwright/test";

import { exportAccessTests } from "./suites/access.spec";
import { exportDownloadTests } from "./suites/download.spec";
import { exportRenderTests } from "./suites/render.spec";

test.describe("Admin — Export", () => {
  exportAccessTests();
  exportRenderTests();
  exportDownloadTests();
});
