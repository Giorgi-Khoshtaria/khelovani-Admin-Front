import { test } from "@playwright/test";
import { loginValidationTests } from "./suites/login-validation.spec";
import { navigationGuardTests } from "./suites/navigation-guard.spec";
import { securityTests } from "./suites/security.spec";
import { sessionTests } from "./suites/session.spec";
import { logoutTests } from "./suites/logout.spec";
import { loginTests } from "./suites/login.spec";
test.describe("Login-Tests", () => {
  loginValidationTests();
  loginTests();
  logoutTests();
  navigationGuardTests();
  securityTests();
  sessionTests();
});
