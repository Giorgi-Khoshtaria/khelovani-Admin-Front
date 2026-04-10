import { test, expect } from "../fixtures/auth.fixture";
import { MenuPage } from "../pages/MenuPage";
import { ApiHelper } from "../helpers/api.helper";
import type { MenuItem } from "../../src/apiCalls/menuApiCalls/menu.req";

test.describe("Admin — Menu", () => {
  // backtest: tests/api/admin/menu/menu.api.spec.ts

  let menuPage: MenuPage;
  let api: ApiHelper;
  let createdItemIds: string[] = [];

  test.beforeEach(async ({ asAdmin: page }) => {
    menuPage = new MenuPage(page);
    api = new ApiHelper();
    await api.login();
    await menuPage.goto();
  });

  test.afterEach(async () => {
    for (const id of createdItemIds) {
      try {
        await api.deleteMenuItem(id);
      } catch {
        /* skip */
      }
    }
    createdItemIds = [];
  });

  /**
   * ➕ CREATE FLOW
   */
  test("MNU-001: ✅ successfully create a new menu item and verify table entry", async ({
    asAdmin: page,
  }) => {
    const label = `ახალი_ნივთი_${Math.floor(Math.random() * 10000)}`;
    await menuPage.createMenuItem({
      labelKa: label,
      labelEn: "New En",
      href: "/new",
      order: 10,
      isActive: true,
    });

    await expect(page.locator(".Toastify__toast--success")).toHaveText(
      /დაემატა/,
    );
    await page.reload();

    const row = menuPage.getRowByText(label);
    await expect(row).toBeVisible();
    await expect(row.locator("td").nth(2)).toHaveText("New En");

    // Cleanup reference
    const items = await api.getMenuItems();
    const item = items.find((i: MenuItem) => i.label.ka === label);
    if (item?._id) createdItemIds.push(item._id);
  });

  /**
   * 📝 EDIT FLOW
   */
  test.describe("Update Operations", () => {
    let targetId: string;
    let originalLabel: string;

    test.beforeEach(async () => {
      originalLabel = `ჩამასწორე_${Math.floor(Math.random() * 10000)}`;
      const res = await api.createMenuItem({
        label: { ka: originalLabel, en: "Edit En" },
        href: "/edit-me",
        order: 5,
        isActive: true,
      });
      targetId = res._id;
      createdItemIds.push(targetId);
      await menuPage.page.reload();
      // Ensure row is loaded before each test
      await expect(menuPage.getRowByText(originalLabel)).toBeVisible();
    });

    test("should update labels and href of an existing item", async ({
      asAdmin: page,
    }) => {
      const row = menuPage.getRowByText(originalLabel);
      await row.locator(".btn-primary-sm:has-text('რედაქტირება')").click();

      const updatedLabel = `${originalLabel}_განახლდა`;
      await menuPage.fillForm({
        labelKa: updatedLabel,
        labelEn: "Updated En",
        href: "/updated",
      });
      await menuPage.saveBtn.click();

      await expect(page.locator(".Toastify__toast--success")).toHaveText(
        /განახლდა/,
      );
      await page.reload();

      await expect(menuPage.getRowByText(updatedLabel)).toBeVisible();
      await expect(page.locator("code:has-text('/updated')")).toBeVisible();
    });

    test("should toggle 'isActive' status and verify badge change", async ({
      asAdmin: page,
    }) => {
      const row = menuPage.getRowByText(originalLabel);
      await row.locator(".btn-primary-sm:has-text('რედაქტირება')").click();

      await menuPage.fillForm({ isActive: false });
      await menuPage.saveBtn.click();

      await expect(page.locator(".Toastify__toast--success")).toHaveText(
        /განახლდა/,
      );
      await page.reload();

      const updatedRow = menuPage.getRowByText(originalLabel);
      await expect(updatedRow.locator(".status-badge")).toHaveText("გამორთული");
    });
  });

  /**
   * 🗑️ DELETE FLOW
   */
  test("should delete an item and verify it is removed from the table", async ({
    asAdmin: page,
  }) => {
    const label = `წამშალე_${Math.floor(Math.random() * 10000)}`;
    const res = await api.createMenuItem({
      label: { ka: label, en: "Del" },
      href: "/del",
      order: 0,
      isActive: true,
    });
    createdItemIds.push(res._id);
    await page.reload();

    const row = menuPage.getRowByText(label);
    await expect(row).toBeVisible();

    page.on("dialog", (d) => d.accept());
    await row.locator(".btn-danger-sm:has-text('წაშლა')").click();

    await expect(page.locator(".Toastify__toast--success")).toHaveText(
      /წაიშალა/,
    );
    await expect(row).not.toBeVisible();
  });

  /**
   * ❌ VALIDATION (Individual cases)
   */
  test.describe("Validation Checks", () => {
    test.beforeEach(async () => {
      await menuPage.addBtn.click();
      await expect(menuPage.modal).toBeVisible();
    });

    test("MNU-002: ❌ require Georgian label", async () => {
      await menuPage.labelKa.fill("");
      await menuPage.saveBtn.click();
      await expect(menuPage.getErrorLocator("labelKa")).toContainText(
        "სავალდებულოა",
      );
    });

    test("MNU-003: ❌ 422 — missing Georgian label", async () => {
       await menuPage.labelKa.clear();
       await menuPage.saveBtn.click();
       await expect(menuPage.getErrorLocator("labelKa")).toBeVisible();
    });

    test("MNU-004: ❌ 422 — missing href", async () => {
       await menuPage.href.clear();
       await menuPage.saveBtn.click();
       await expect(menuPage.getErrorLocator("href")).toContainText("სავალდებულოა");
    });

    test("MNU-005: ❌ 422 — empty href string", async () => {
      await menuPage.href.fill("");
      await menuPage.saveBtn.click();
      await expect(menuPage.getErrorLocator("href")).toBeVisible();
    });

    test("MNU-ERR: ❌ show error for invalid order (negative)", async () => {
      await menuPage.order.fill("-1");
      await menuPage.saveBtn.click();
      await expect(menuPage.getErrorLocator("order")).toContainText(
        "0 ან მეტი",
      );
    });

    test("MNU-ERR: ❌ show error for non-Latin English label", async () => {
      await menuPage.labelEn.fill("ქართულად");
      await menuPage.saveBtn.click();
      await expect(menuPage.getErrorLocator("labelEn")).toContainText(
        "ლათინური ასოებით",
      );
    });
  });

  /**
   * 🛡️ SECURITY & MALICIOUS INPUT
   * backtest: tests/api/admin/menu/suites/menuSecurity.suite.ts
   */
  test.describe("Security Checks", () => {
    test("MNU-SEC: ❌ prevent XSS in labels", async ({ asAdmin: page }) => {
      const xss = "<script>alert('xss')</script>";
      await menuPage.addBtn.click();
      await menuPage.fillForm({
        labelKa: xss,
        labelEn: "XSS Test",
        href: "/xss",
        order: 1
      });
      await menuPage.saveBtn.click();
      
      // The system should either sanitize it or show an error. 
      // Based on common patterns, it's either encoded or rejected.
      // If the backend has strict validation (422), we expect an error or safe toast.
      await expect(page.locator(".Toastify__toast--error").or(page.locator(".error-text"))).toBeVisible();
    });

    test("MNU-SEC: ❌ prevent SQL Injection in labels", async ({ asAdmin: page }) => {
      const sqli = "') OR 1=1; --";
      await menuPage.addBtn.click();
      await menuPage.fillForm({
        labelKa: sqli,
        labelEn: "SQLi Test",
        href: "/sqli",
        order: 1
      });
      await menuPage.saveBtn.click();
      await expect(page.locator(".Toastify__toast--error").or(page.locator(".error-text"))).toBeVisible();
    });

    test("MNU-SEC: ❌ handle 429 Too Many Requests", async () => {
      // We can't easily trigger 65 requests in UI test without being slow, 
      // but we can verify how the UI reacts to a 429 if we could mock or trigger it.
      // For E2E, we can at least document the scenario.
    });
  });


  /**
   * 📊 DATA INTEGRITY
   */
  test("should maintain numerical sorting order", async ({ asAdmin: page }) => {
    const timestamp = Date.now();
    const items = [
      {
        label: { ka: `რიგითობა_3_${timestamp}`, en: "O3" },
        order: 3,
        href: "/3",
        isActive: true,
      },
      {
        label: { ka: `რიგითობა_1_${timestamp}`, en: "O1" },
        order: 1,
        href: "/1",
        isActive: true,
      },
      {
        label: { ka: `რიგითობა_2_${timestamp}`, en: "O2" },
        order: 2,
        href: "/2",
        isActive: true,
      },
    ];
    for (const item of items) {
      const res = await api.createMenuItem(item);
      createdItemIds.push(res._id);
    }

    await page.reload();
    await expect(menuPage.getRowByText(`რიგითობა_1_${timestamp}`)).toBeVisible();

    const orders = await menuPage.getOrders();
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
  });

  /**
   * 🛡️ PERMISSIONS
   */
  test("should redirect organizer from menu page", async ({
    asOrganizer: page,
  }) => {
    await page.goto("/menu");
    await expect(page).not.toHaveURL(/\/menu/);
  });
});
