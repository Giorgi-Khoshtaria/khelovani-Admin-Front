import test from "@playwright/test";
import { usersAccessTests } from "./suites/access.spec";
import { usersListTests } from "./suites/list.spec";
import { usersSearchTests } from "./suites/search.spec";
import { usersFiltersTests } from "./suites/filters.spec";
import { usersPaginationTests } from "./suites/pagination.spec";
import { usersRowActionsTests } from "./suites/row-actions.spec";
import { usersDeleteTests } from "./suites/delete.spec";
import { usersDetailsTests } from "./suites/details.spec";
import { usersBulkDeleteTests } from "./suites/bulkDelete.spec";
import { usersErrorStatesTests } from "./suites/error-states.spec";
import { usersRbacTests } from "./suites/rbac.spec";
import { usersSecurityTests } from "./suites/security.spec";

test.describe("Admin — Users", () => {
  usersAccessTests();
  usersListTests();
  usersSearchTests();
  usersFiltersTests();
  usersPaginationTests();
  usersRowActionsTests();
  usersDeleteTests();
  usersDetailsTests();
  usersBulkDeleteTests();
  usersErrorStatesTests();
  usersRbacTests();
  usersSecurityTests();
});
