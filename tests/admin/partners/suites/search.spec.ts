import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { waitForApiResponse } from "../../../helpers/validation.helper";
export const partnersSearchTests = () => {
  test.describe("Admin — Partners › Search", () => {
    let partnersPage: PartnersPage;
    let api: ApiHelper;
    let createdIds: string[] = [];

    const generateIdCode = () =>
      Math.floor(Math.random() * 899999999 + 100000000).toString();
    const generatePhone = () =>
      "5" + Math.floor(Math.random() * 89999999 + 10000000).toString();

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

    test("search by company name returns matching partner card", async ({
      asAdmin: page,
    }) => {
      const name = `ძიება_${Date.now()}`;
      const res = await api.createPartner({
        companyNameGe: name,
        companyNameEn: `Search_En_${Date.now()}`,
        email: `search-${Date.now()}@test.com`,
        phone: generatePhone(),
        identificationCode: generateIdCode(),
        contactPerson: "Search Tester",
        city: "tbilisi",
        address: "თბილისი, ქუჩა 1",
        addressEn: "Tbilisi, Street 1",
      });
      createdIds.push(res._id ?? res.data?._id);

      await partnersPage.tabs.all.click();
      await partnersPage.searchInput.fill(name);
      await waitForApiResponse(page, "/api/admin/partners");

      await expect(partnersPage.getCardByName(name)).toBeVisible();
    });

    test("search by email returns matching partner card", async ({
      asAdmin: page,
    }) => {
      const email = `email-search-${Date.now()}@test.com`;
      const name = `ემეილი_${Date.now()}`;
      const res = await api.createPartner({
        companyNameGe: name,
        companyNameEn: `Email_En_${Date.now()}`,
        email,
        phone: generatePhone(),
        identificationCode: generateIdCode(),
        contactPerson: "Email Tester",
        city: "batumi",
        address: "ბათუმი, ქუჩა 1",
        addressEn: "Batumi, Street 1",
      });
      createdIds.push(res._id ?? res.data?._id);

      await partnersPage.tabs.all.click();
      await partnersPage.searchInput.fill(email);
      await waitForApiResponse(page, "/api/admin/partners");

      await expect(partnersPage.getCardByName(name)).toBeVisible();
    });

    test("search with no matches shows empty state", async ({
      asAdmin: page,
    }) => {
      await partnersPage.tabs.all.click();
      await partnersPage.searchInput.fill("_zzz_no_match_xyz_99999_");
      await waitForApiResponse(page, "/api/admin/partners");

      await expect(
        page.locator(".empty-state, .no-data, .no-results"),
      ).toBeVisible();
    });

    test("clearing search restores full list", async ({ asAdmin: page }) => {
      await partnersPage.searchInput.fill("nonexistent_xyz");
      await waitForApiResponse(page, "/api/admin/partners");

      await partnersPage.searchInput.clear();
      await waitForApiResponse(page, "/api/admin/partners");

      await expect(partnersPage.partnerCards.first()).toBeVisible();
    });
  });
};
