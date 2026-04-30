import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const partnersVisibilityTests = () => {
  test.describe("Admin — Partners › Visibility", () => {
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
        contactPerson: "Vis Person",
        city: "tbilisi",
        email: `vis-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`,
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

    test("visibility button visible on card for admin", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`vis_card_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();

      const card = partnersPage.getCardByName(partner.companyNameGe);
      await expect(card.locator(".visibility-btn")).toBeVisible();
    });

    test("hiding a partner shows hidden badge on card", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`hide_badge_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();

      const card = partnersPage.getCardByName(partner.companyNameGe);
      await card.locator(".visibility-btn").click();
      await page.waitForResponse((r) => r.url().includes("/visibility"));

      await expect(card.locator(".partner-card__hidden-badge")).toBeVisible();
      await expect(card).toHaveClass(/hidden-partner/);
    });

    test("hidden card still visible in admin listing (admin sees all)", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`hidden_visible_${Date.now()}`);
      await api.setPartnerVisibility(partner._id, false);

      await partnersPage.goto();
      await partnersPage.tabs.approved.click();
      await partnersPage.searchInput.fill(partner.companyNameGe);
      await page.waitForResponse((r) => r.url().includes("/api/admin/partners"));

      await expect(partnersPage.getCardByName(partner.companyNameGe)).toBeVisible();
    });

    test("re-showing a partner removes hidden badge", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`show_again_${Date.now()}`);
      await api.setPartnerVisibility(partner._id, false);

      await partnersPage.goto();
      await partnersPage.tabs.approved.click();
      await partnersPage.searchInput.fill(partner.companyNameGe);
      await page.waitForResponse((r) => r.url().includes("/api/admin/partners"));

      const card = partnersPage.getCardByName(partner.companyNameGe);
      await card.locator(".visibility-btn").click();
      await page.waitForResponse((r) => r.url().includes("/visibility"));

      await expect(card.locator(".partner-card__hidden-badge")).not.toBeVisible();
      await expect(card).not.toHaveClass(/hidden-partner/);
    });

    test("visibility button visible on detail page for admin", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`vis_detail_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();
      await partnersPage.gotoDetails(partner.companyNameGe);

      await expect(partnersPage.visibilityBtn).toBeVisible();
    });

    test("hiding from detail page shows 🙈 text in button", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`hide_det_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();
      await partnersPage.gotoDetails(partner.companyNameGe);

      await partnersPage.visibilityBtn.click();
      await page.waitForResponse((r) => r.url().includes("/visibility"));

      await expect(partnersPage.visibilityBtn).toHaveClass(/hidden/);
      await expect(partnersPage.visibilityBtn).toContainText("🙈");
    });

    test("toast shown when partner is hidden", async ({ asAdmin: page }) => {
      const partner = await createApprovedPartner(`vis_toast_${Date.now()}`);
      await partnersPage.goto();
      await partnersPage.tabs.approved.click();
      await partnersPage.gotoDetails(partner.companyNameGe);

      await partnersPage.visibilityBtn.click();
      await expect(
        page.getByText("დაიმალა").or(page.getByText("hidden")),
      ).toBeVisible({ timeout: 8000 });
    });
  });
};
