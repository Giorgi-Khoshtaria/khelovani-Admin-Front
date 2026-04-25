import test from "@playwright/test";

import { translationsCreateTests } from "./suites/create.spec";
import { translationsEditTests } from "./suites/edit.spec";
import { translationsDeleteTests } from "./suites/delete.spec";
import { translationsSearchTests } from "./suites/search.spec";
import { translationsValidationTests } from "./suites/validation.spec";
import { translationsSecurityTests } from "./suites/security.spec";

test.describe("Admin — Translations", () => {
  translationsSearchTests();
  translationsCreateTests();
  translationsEditTests();
  translationsDeleteTests();
  translationsValidationTests();
  translationsSecurityTests();
});
