import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const partnersBulkOperationsTests = () => {
  test.describe("Admin — Partners › Details", () => {
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

    test("navigating to details shows correct company name in h1", async ({
      asAdmin: page,
    }) => {
      const data = {
        companyNameGe: `დეტალი_${Date.now()}`,
        companyNameEn: "Detail Test En",
        identificationCode: generateIdCode(),
        contactPerson: "Detail Person",
        city: "tbilisi" as const,
        phone: generatePhone(),
        email: `detail-${Date.now()}@test.com`,
        address: "თბილისი, ქუჩა",
        addressEn: "Tbilisi, St",
      };

      const res = await api.createPartner(data);
      createdIds.push(res._id);

      await page.reload();
      await partnersPage.gotoDetails(data.companyNameGe);

      await expect(page.locator("h1")).toContainText(data.companyNameGe);
    });

    test("details page fields contain correct data from registration", async ({
      asAdmin: page,
    }) => {
      const data = {
        companyNameGe: `ინტეგრ_${Date.now()}`,
        companyNameEn: "Integrity En",
        identificationCode: generateIdCode(),
        contactPerson: "Integrity Person",
        city: "tbilisi" as const,
        phone: generatePhone(),
        email: `integrity-${Date.now()}@test.com`,
        address: "თბილისი, მისამართი",
        addressEn: "Tbilisi, Address",
      };

      const res = await api.createPartner(data);
      createdIds.push(res._id);

      await page.reload();
      await partnersPage.gotoDetails(data.companyNameGe);

      await expect(
        partnersPage.getDetailedField("identificationCode"),
      ).toHaveValue(data.identificationCode);
      await expect(partnersPage.getDetailedField("contactPerson")).toHaveValue(
        data.contactPerson,
      );
      await expect(partnersPage.getDetailedField("email")).toHaveValue(
        data.email,
      );
      await expect(partnersPage.getDetailedField("phone")).toHaveValue(
        data.phone,
      );
    });

    test("back button returns to partners list", async ({ asAdmin: page }) => {
      const data = {
        companyNameGe: `უკან_${Date.now()}`,
        companyNameEn: "Back Test En",
        identificationCode: generateIdCode(),
        contactPerson: "Back Person",
        city: "batumi" as const,
        phone: generatePhone(),
        email: `back-${Date.now()}@test.com`,
        address: "ბათუმი, ქუჩა",
        addressEn: "Batumi, St",
      };

      const res = await api.createPartner(data);
      createdIds.push(res._id);

      await page.reload();
      await partnersPage.gotoDetails(data.companyNameGe);
      await partnersPage.backBtn.click();
      await expect(page).toHaveURL(/\/partners/);
    });
  });
};
