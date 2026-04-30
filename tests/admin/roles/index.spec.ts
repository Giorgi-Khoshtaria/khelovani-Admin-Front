import test from "@playwright/test";
import { rolesCreateTests } from "./suites/create.spec";
import { rolesDeleteTests } from "./suites/delete.spec";
import { rolesListTests } from "./suites/list.spec";
import { rolesPermissionsTests } from "./suites/permissions.spec";
import { rolesValidationTests } from "./suites/validation.spec";
import { rolesPermissionCreateTests } from "./suites/permissionCreate.spec";
import { rolesSystemRoleProtectionTests } from "./suites/systemRoleProtection.spec";

test.describe("Admin — Roles", () => {
  rolesListTests();
  rolesCreateTests();
  rolesDeleteTests();
  rolesPermissionsTests();
  rolesValidationTests();
  rolesPermissionCreateTests();
  rolesSystemRoleProtectionTests();
});
