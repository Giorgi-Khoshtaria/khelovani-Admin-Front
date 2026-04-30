import test from "@playwright/test";

import { partnersBulkTests } from "./suites/bulk.spec";
import { partnersBulkOperationsTests } from "./suites/details.spec";
import { partnersListTests } from "./suites/list.spec";
import { partnersSearchTests } from "./suites/search.spec";
import { partnersStatusTests } from "./suites/status.spec";
import { partnersPinTests } from "./suites/pin.spec";
import { partnersVisibilityTests } from "./suites/visibility.spec";

test.describe("Admin — Partners", () => {
  partnersListTests();
  partnersSearchTests();
  partnersStatusTests();
  partnersBulkOperationsTests();
  partnersBulkTests();
  partnersPinTests();
  partnersVisibilityTests();
});
