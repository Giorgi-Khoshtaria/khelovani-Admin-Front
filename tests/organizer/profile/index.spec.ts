import test from "@playwright/test";
import { editProfileTests } from "./suites/edit.spec";
import { validationTests } from "./suites/validation.spec";
import { viewTests } from "./suites/view.spec";
import { profileSecurityTests } from "./suites/security.spec";

test.describe("Organizer — Profile", () => {
  viewTests();
  editProfileTests();
  validationTests();
  profileSecurityTests();
});
