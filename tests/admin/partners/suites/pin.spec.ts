import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const partnersPinTests = () => {
  test.describe("Admin — Partners › Pin", () => {
    let partnersPage: PartnersPage;
    let api: ApiHelper;
    let createdIds: string[] = [];

    const generateIdCode = () =>
      Math.floor(Math.random() * 899999999 + 100000000).toString();
    const generatePhone = () =>
      "5" + Math.floor(Math.random() * 89999999 + 10000000).toString();

    async function createApprovedPartner(name: string) {
      const res = await api.createPartner({
        companyNameGe: name,
        companyNameEn: `${name} En`,
        identificationCode: generateIdCode(),
        phone: generatePhone(),
        contactPerson: "Pin Person",
        city: "tbilisi",
        email: `pin-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`,
        address: "თბილისი",
        addressEn: "Tbilisi",
      });
      createdIds.push(res._id);
      await api.approvePartner(res._id);
      return res;
    }

    test.beforeEach(async ({ asAdmin: page }) => {
      partnersPage = new PartnersPage(page);
      api = new ApiHelper();
      await api.login();
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        try { await api.deletePartner(id); } catch { /* skip */ }
      }
      createdIds = [];
    });

    test("pin button visible on partner card for admin", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`pin_vis_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();

      const card = partnersPage.getCardByName(partner.companyNameGe);
      await expect(card.locator(".pin-btn")).toBeVisible();
    });

    test("clicking pin button on card shows pin badge", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`pin_card_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();

      const card = partnersPage.getCardByName(partner.companyNameGe);
      await card.locator(".pin-btn").click();
      await page.waitForResponse((r) => r.url().includes("/pin"));

      await expect(card.locator(".partner-card__pin-badge")).toBeVisible();
      await expect(card.locator(".pin-btn")).toHaveClass(/active/);
    });

    test("clicking unpin removes the pin badge", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`unpin_${Date.now()}`);
      await api.pinPartner(partner._id, true);

      await partnersPage.goto();
      await partnersPage.tabs.approved.click();

      const card = partnersPage.getCardByName(partner.companyNameGe);
      await expect(card.locator(".partner-card__pin-badge")).toBeVisible();

      await card.locator(".pin-btn").click();
      await page.waitForResponse((r) => r.url().includes("/pin"));

      await expect(card.locator(".partner-card__pin-badge")).not.toBeVisible();
    });

    test("pin button visible on detail page for admin", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`pin_detail_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();
      await partnersPage.gotoDetails(partner.companyNameGe);

      await expect(partnersPage.pinBtn).toBeVisible();
    });

    test("pin from detail page shows active state", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`pin_det_active_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();
      await partnersPage.gotoDetails(partner.companyNameGe);

      await partnersPage.pinBtn.click();
      await page.waitForResponse((r) => r.url().includes("/pin"));

      await expect(partnersPage.pinBtn).toHaveClass(/active/);
    });

    test("toast shown when partner is pinned", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`pin_toast_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();
      await partnersPage.gotoDetails(partner.companyNameGe);

      await partnersPage.pinBtn.click();
      await expect(
        page.getByText("დაიპინა").or(page.getByText("პინი")),
      ).toBeVisible({ timeout: 8000 });
    });
  });
};
