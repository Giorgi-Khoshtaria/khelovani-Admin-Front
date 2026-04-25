import { test } from "../../../fixtures/auth.fixture";
import { ExportPage } from "../../../pages/ExportPage";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const exportDownloadTests = () => {
  test.describe("Admin — Export › Download", () => {
    let exportPage: ExportPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      exportPage = new ExportPage(page);
      await exportPage.goto();
    });

    test("export translations button shows success toast", async ({
      asAdmin: page,
    }) => {
      await exportPage.exportButtons.translations.click();
      await expectSuccessToast(page);
    });

    test("export roles button shows success toast", async ({
      asAdmin: page,
    }) => {
      await exportPage.exportButtons.roles.click();
      await expectSuccessToast(page);
    });

    test("export permissions button shows success toast", async ({
      asAdmin: page,
    }) => {
      await exportPage.exportButtons.permissions.click();
      await expectSuccessToast(page);
    });
  });
};
