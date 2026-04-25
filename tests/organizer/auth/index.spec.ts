import test from "@playwright/test";
import { accessControlTests } from "./suites/access-control.spec";
import { logoutTests } from "./suites/logout.spec";
import { sessionTests } from "./suites/session.spec";
import { loginTests } from "./suites/login.spec";

test.describe("Organizer — Auth", () => {
  loginTests();
  logoutTests();
  accessControlTests();
  sessionTests();
});
