import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const partnersStatusTests = () => {
  test.describe("Admin — Partners › Status Transitions", () => {
    let partnersPage: PartnersPage;
    let api: ApiHelper;
    let createdIds: string[] = [];

    const generateIdCode = () =>
      Math.floor(Math.random() * 899999999 + 100000000).toString();
    const generatePhone = () =>
      "5" + Math.floor(Math.random() * 89999999 + 10000000).toString();

    async function createAndNavigate(
      page: import("@playwright/test").Page,
      name: string,
    ) {
      const res = await api.createPartner({
        companyNameGe: name,
        companyNameEn: `${name} En`,
        identificationCode: generateIdCode(),
        phone: generatePhone(),
        contactPerson: "Status Person",
        city: "tbilisi",
        email: `status-${Date.now()}@test.com`,
        address: "თბილისი, ქუჩა",
        addressEn: "Tbilisi, St",
      });
      createdIds.push(res._id);
      await page.reload();
      await partnersPage.tabs.pending.click();
      await partnersPage.gotoDetails(name);
      return res._id;
    }

    test.beforeEach(async ({ asAdmin: page }) => {
      partnersPage = new PartnersPage(page);
      api = new ApiHelper();
      await api.login();
      await partnersPage.goto();
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        try {
          await api.deletePartner(id);
        } catch {
          /* skip */
        }
      }
      createdIds = [];
    });

    test("approve pending partner → badge shows 'დადასტურებული'", async ({
      asAdmin: page,
    }) => {
      const name = `დამტკ_${Date.now()}`;
      await createAndNavigate(page, name);

      await expect(partnersPage.statusBadge).toHaveText("მოლოდინი");
      await partnersPage.approveBtn.click();
      await expectSuccessToast(page, /წარმატებით/);
      await expect(partnersPage.statusBadge).toHaveText("დადასტურებული");
    });

    test("approved partner appears in the 'Approved' tab", async ({
      asAdmin: page,
    }) => {
      const name = `approved_tab_${Date.now()}`;
      await createAndNavigate(page, name);
      await partnersPage.approveBtn.click();
      await expectSuccessToast(page, /წარმატებით/);

      await partnersPage.backBtn.click();
      await partnersPage.tabs.approved.click();
      await partnersPage.searchInput.fill(name);
      await page.waitForResponse((r) =>
        r.url().includes("/api/admin/partners"),
      );
      await expect(partnersPage.getCardByName(name)).toBeVisible();
    });

    test("ban approved partner → badge shows 'დაბლოკილი'", async ({
      asAdmin: page,
    }) => {
      const name = `საბანი_${Date.now()}`;
      await createAndNavigate(page, name);
      await partnersPage.approveBtn.click();
      await expectSuccessToast(page, /წარმატებით/);

      await partnersPage.banBtn.click();
      await expectSuccessToast(page, /წარმატებით/);
      await expect(partnersPage.statusBadge).toHaveText("დაბლოკილი");
    });

    test("banned partner appears in the 'Banned' tab", async ({
      asAdmin: page,
    }) => {
      const name = `banned_tab_${Date.now()}`;
      await createAndNavigate(page, name);
      await partnersPage.approveBtn.click();
      await expectSuccessToast(page);
      await partnersPage.banBtn.click();
      await expectSuccessToast(page);

      await partnersPage.backBtn.click();
      await partnersPage.tabs.banned.click();
      await partnersPage.searchInput.fill(name);
      await page.waitForResponse((r) =>
        r.url().includes("/api/admin/partners"),
      );
      await expect(partnersPage.getCardByName(name)).toBeVisible();
    });

    test("reject (delete) partner → removed from list", async ({
      asAdmin: page,
    }) => {
      const name = `უარი_${Date.now()}`;
      await createAndNavigate(page, name);

      page.on("dialog", (d) => d.accept());
      await partnersPage.rejectBtn.click();

      await expect(
        page.getByText("წარმატებით").or(page.getByText("წაიშალა")),
      ).toBeVisible({ timeout: 10000 });
      await expect(page).toHaveURL(/\/partners/);

      await partnersPage.searchInput.fill(name);
      await page.waitForResponse((r) =>
        r.url().includes("/api/admin/partners"),
      );
      await expect(partnersPage.getCardByName(name)).not.toBeVisible();
      createdIds = createdIds.filter(() => false); // already deleted
    });
  });
};
