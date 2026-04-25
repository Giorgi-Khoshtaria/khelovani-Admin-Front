import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";

export const viewTests = () => {
  test.describe("View", () => {
    let profile: PartnersPage;

    test.beforeEach(async ({ asOrganizer: page }) => {
      profile = new PartnersPage(page);
      await profile.gotoProfile();
    });

    test("profile page loads with company name populated", async ({
      asOrganizer: page,
    }) => {
      await expect(page).toHaveURL(/\/profile/);
      await profile.openEdit();
      await expect(profile.companyNameGe).not.toHaveValue("");
    });

    test("edit mode reveals editable form fields", async () => {
      await profile.openEdit();
      await expect(profile.companyNameGe).toBeVisible();
      await expect(profile.phone).toBeVisible();
      await expect(profile.email).toBeVisible();
      await expect(profile.contactPerson).toBeVisible();
    });
  });
};
