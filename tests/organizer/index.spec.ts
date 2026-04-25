import test from "@playwright/test";
import "./auth/index.spec";
import "./products/index.spec";
import "./profile/index.spec";

test.describe("Organizer", () => {
  // suites are self-contained in their own describe blocks;
  // this file exists so `npx playwright test tests/organizer/` runs everything
});
