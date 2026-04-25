import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";

export const partnersListTests = () => {
  test.describe("Admin — Partners › List & Tabs", () => {
    let partnersPage: PartnersPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      partnersPage = new PartnersPage(page);
      await partnersPage.goto();
    });

    test("partners list page loads at /partners", async ({ asAdmin: page }) => {
      await expect(page).toHaveURL(/\/partners/);
    });

    test("'Pending' tab filters by status=PENDING", async ({
      asAdmin: page,
    }) => {
      await partnersPage.tabs.pending.click();
      await expect(page).toHaveURL(/status=PENDING/);
    });

    test("'Approved' tab filters by status=APPROVED", async ({
      asAdmin: page,
    }) => {
      await partnersPage.tabs.approved.click();
      await expect(page).toHaveURL(/status=APPROVED/);
    });

    test("'Banned' tab filters by status=BANNED", async ({ asAdmin: page }) => {
      await partnersPage.tabs.banned.click();
      await expect(page).toHaveURL(/status=BANNED/);
    });

    test("'All' tab removes status filter from URL", async ({
      asAdmin: page,
    }) => {
      await partnersPage.tabs.pending.click();
      await partnersPage.tabs.all.click();
      await expect(page).not.toHaveURL(/status=/);
    });

    test("pagination shows page info and next/prev buttons when data exists", async () => {
      await partnersPage.tabs.all.click();
      if (await partnersPage.pageInfo.isVisible()) {
        await expect(partnersPage.pageInfo).toContainText("გვერდი 1 /");
        if (await partnersPage.nextPageBtn.isEnabled()) {
          await partnersPage.nextPageBtn.click();
          await expect(partnersPage.pageInfo).toContainText("გვერდი 2 /");
          await partnersPage.prevPageBtn.click();
          await expect(partnersPage.pageInfo).toContainText("გვერდი 1 /");
        }
      }
    });
  });
};
