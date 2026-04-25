import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const partnersBulkTests = () => {
  test.describe("Admin — Partners › Bulk Operations", () => {
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

    test("select all checkbox selects all visible cards", async ({
      asAdmin: page,
    }) => {
      const suffix = Date.now();
      const r1 = await api.createPartner({
        companyNameGe: `ბალქი_ა_${suffix}`,
        companyNameEn: "Bulk A",
        identificationCode: generateIdCode(),
        phone: generatePhone(),
        contactPerson: "B A",
        city: "tbilisi",
        email: `bulk-a-${suffix}@test.com`,
        address: "მისამართი",
        addressEn: "Address",
      });
      createdIds.push(r1._id);

      await page.reload();
      await partnersPage.searchInput.fill(`ბალქი_ა_${suffix}`);
      await page.waitForResponse((r) =>
        r.url().includes("/api/admin/partners"),
      );

      await partnersPage.selectAllCheckbox.click();
      await expect(partnersPage.bulkDeleteBtn).toBeVisible();
    });

    test("bulk delete two partners → both cards disappear", async ({
      asAdmin: page,
    }) => {
      const suffix = Date.now();
      const r1 = await api.createPartner({
        companyNameGe: `ბ1_${suffix}`,
        companyNameEn: "Bulk1",
        identificationCode: generateIdCode(),
        phone: generatePhone(),
        contactPerson: "B1",
        city: "tbilisi",
        email: `b1-${suffix}@test.com`,
        address: "მისამართი",
        addressEn: "Address",
      });
      const r2 = await api.createPartner({
        companyNameGe: `ბ2_${suffix}`,
        companyNameEn: "Bulk2",
        identificationCode: generateIdCode(),
        phone: generatePhone(),
        contactPerson: "B2",
        city: "tbilisi",
        email: `b2-${suffix}@test.com`,
        address: "მისამართი",
        addressEn: "Address",
      });
      createdIds.push(r1._id, r2._id);

      await page.reload();
      await partnersPage.searchInput.fill(`_${suffix}`);
      await expect(partnersPage.partnerCards).toHaveCount(2, { timeout: 7000 });

      await partnersPage.selectAllCheckbox.click();
      await expect(partnersPage.bulkDeleteBtn).toContainText("წაშლა (2)");

      page.on("dialog", (d) => d.accept());
      await partnersPage.bulkDeleteBtn.click();

      await expectSuccessToast(page);
      await expect(
        partnersPage.getCardByName(`ბ1_${suffix}`),
      ).not.toBeVisible();
      await expect(
        partnersPage.getCardByName(`ბ2_${suffix}`),
      ).not.toBeVisible();
      createdIds = [];
    });
  });
};
