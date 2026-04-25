import { test, expect } from "../../../fixtures/auth.fixture";
import { MenuPage } from "../../../pages/MenuPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const menuOrderingTests = () => {
  test.describe("Admin — Menu › Ordering", () => {
    let menuPage: MenuPage;
    let api: ApiHelper;
    let createdIds: string[] = [];

    test.beforeEach(async ({ asAdmin: page }) => {
      menuPage = new MenuPage(page);
      api = new ApiHelper();
      await api.login();
      await menuPage.goto();
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        try {
          await api.deleteMenuItem(id);
        } catch {
          /* skip */
        }
      }
      createdIds = [];
    });

    test("items are displayed in ascending numerical order", async ({
      asAdmin: page,
    }) => {
      const s = String(Date.now()).slice(-5);
      const items = [
        {
          label: { ka: `ო3_${s}`, en: "O3" },
          order: 30,
          href: `/o3-${s}`,
          isActive: true,
        },
        {
          label: { ka: `ო1_${s}`, en: "O1" },
          order: 10,
          href: `/o1-${s}`,
          isActive: true,
        },
        {
          label: { ka: `ო2_${s}`, en: "O2" },
          order: 20,
          href: `/o2-${s}`,
          isActive: true,
        },
      ];

      for (const item of items) {
        const res = await api.createMenuItem(item);
        createdIds.push(res._id);
      }

      await page.reload();
      await expect(menuPage.getRowByText(`ო1_${s}`)).toBeVisible();

      const orders = await menuPage.getOrders();
      const sorted = [...orders].sort((a, b) => a - b);
      expect(orders).toEqual(sorted);
    });
  });
};
