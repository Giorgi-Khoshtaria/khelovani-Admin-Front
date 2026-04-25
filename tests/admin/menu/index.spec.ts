import { test } from "@playwright/test";

import { menuDeleteTests } from "./suites/delete.spec";
import { menuCreateTests } from "./suites/create.spec";
import { menuUpdateTests } from "./suites/update.spec";
import { menuSecurityTests } from "./suites/security.spec";
import { menuOrderingTests } from "./suites/ordering.spec";
import { menuValidationTests } from "./suites/validation.spec";
test.describe("Admin — Menu", () => {
  menuCreateTests();
  menuDeleteTests();
  menuUpdateTests();
  menuSecurityTests();
  menuOrderingTests();
  menuValidationTests();
});
