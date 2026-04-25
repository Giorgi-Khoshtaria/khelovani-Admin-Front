import test from "@playwright/test";
import { accessTests } from "./suites/access.spec";
import { createTests } from "./suites/create.spec";
import { organizerDeleteTests } from "./suites/delete.spec";
import { editTests } from "./suites/edit.spec";
import { listTests } from "./suites/list.spec";
import { ownershipTests } from "./suites/ownership.spec";
import { organizerProductSecurityTests } from "./suites/security.spec";
import { visibilityTests } from "./suites/visibility.spec";
import { validationTests } from "./suites/validation.spec";

test.describe("Organizer — Products", () => {
  accessTests();
  listTests();
  createTests();
  editTests();
  organizerDeleteTests();
  visibilityTests();
  validationTests();
  ownershipTests();
  organizerProductSecurityTests();
});
