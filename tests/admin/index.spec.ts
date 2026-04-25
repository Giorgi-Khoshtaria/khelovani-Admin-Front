import test from "@playwright/test";
import "./auth/index.spec";
import "./products/index.spec";
import "./partners/index.spec";
import "./menu/index.spec";
import "./roles/index.spec";
import "./translations/index.spec";
import "./export/index.spec";
import "./rbac/isolation.spec";

test.describe("Admin", () => {
  // suites are self-contained in their own describe blocks;
  // this file exists so `npx playwright test tests/admin/` runs everything
});
