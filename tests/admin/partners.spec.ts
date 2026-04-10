import { test, expect } from "../fixtures/auth.fixture";
import { PartnersPage } from "../pages/PartnersPage";
import { ApiHelper } from "../helpers/api.helper";

test.describe("Admin — Partners", () => {
  let partnersPage: PartnersPage;
  let api: ApiHelper;
  let createdPartnerIds: string[] = [];

  test.beforeEach(async ({ asAdmin: page }) => {
    partnersPage = new PartnersPage(page);
    api = new ApiHelper();
    await api.login();
    await partnersPage.goto();
  });

  test.afterEach(async () => {
    for (const id of createdPartnerIds) {
      try {
        await api.deletePartner(id);
      } catch {
        /* skip */
      }
    }
    createdPartnerIds = [];
  });

  /**
   * 📋 HELPERS
   */
  const generateIdCode = () =>
    Math.floor(Math.random() * 899999999 + 100000000).toString();
  const generatePhone = () =>
    "5" + Math.floor(Math.random() * 89999999 + 10000000).toString();

  /**
   * 📊 LISTING, SEARCH & FILTER
   */
  test("AA-001: should filter partners by status tabs", async ({
    asAdmin: page,
  }) => {
    await partnersPage.tabs.pending.click();
    await expect(page).toHaveURL(/status=PENDING/);
    await partnersPage.tabs.approved.click();
    await expect(page).toHaveURL(/status=APPROVED/);
    await partnersPage.tabs.banned.click();
    await expect(page).toHaveURL(/status=BANNED/);
    await partnersPage.tabs.all.click();
    await expect(page).not.toHaveURL(/status=/);
  });

  test("AA-002: should search partners by name and email", async ({
    asAdmin: page,
  }) => {
    const partnerName = `პარტნიორი_${Date.now()}`;
    const email = `search-${Date.now()}@test.com`;
    const idCode = generateIdCode();
    const phone = generatePhone();
    const res = await api.createPartner({
      companyNameGe: partnerName,
      companyNameEn: `Searchable_${Date.now()}`,
      email: email,
      phone: phone,
      identificationCode: idCode,
      contactPerson: "Search Test",
      city: "batumi",
      address: "ბათუმი, რუსთაველი",
      addressEn: "Batumi, Rustaveli",
    });
    createdPartnerIds.push(res._id || res.data?._id);

    await partnersPage.tabs.all.click();
    await partnersPage.searchInput.fill(partnerName);
    await page.waitForTimeout(1500); // Wait for debounce (500ms) + API
    await expect(partnersPage.getCardByName(partnerName)).toBeVisible();

    await partnersPage.searchInput.clear();
    await partnersPage.searchInput.fill(email);
    await page.waitForTimeout(1500);
    await expect(partnersPage.getCardByName(partnerName)).toBeVisible();
  });

  /**
   * 🔍 DETAILED VIEW & DATA INTEGRITY
   */
  test("AA-003: should verify data integrity in detailed view", async ({
    asAdmin: page,
  }) => {
    const data = {
      companyNameGe: `ინტეგრაცია_${Date.now()}`,
      companyNameEn: "Integrity Test En",
      identificationCode: generateIdCode(),
      contactPerson: "Integrity Person",
      city: "tbilisi" as const,
      phone: generatePhone(),
      email: `integrity-${Date.now()}@test.com`,
      address: "თბილისი, მისამართი",
      addressEn: "Integrity St 1 En",
    };
    const res = await api.createPartner(data);
    createdPartnerIds.push(res._id);

    await page.reload();
    await partnersPage.gotoDetails(data.companyNameGe);

    // Verify fields in detailed view
    await expect(page.locator("h1")).toContainText(data.companyNameGe);
    await expect(
      partnersPage.getDetailedField("identificationCode"),
    ).toHaveValue(data.identificationCode);
    await expect(partnersPage.getDetailedField("contactPerson")).toHaveValue(
      data.contactPerson,
    );
    await expect(partnersPage.getDetailedField("email")).toHaveValue(data.email);
    await expect(partnersPage.getDetailedField("phone")).toHaveValue(data.phone);
    await expect(partnersPage.getDetailedField("city")).toHaveValue(data.city);
  });

  /**
   * ⚙️ STATUS TRANSITIONS (LIFECYCLE)
   */
  test("AA-004: should approve a pending partner", async ({ asAdmin: page }) => {
    const name = `დასამტკიცებელი_${Date.now()}`;
    const res = await api.createPartner({
      companyNameGe: name,
      companyNameEn: "To Approve En",
      identificationCode: generateIdCode(),
      phone: generatePhone(),
      contactPerson: "Approve Person",
      city: "batumi",
      email: `approve-${Date.now()}@test.com`,
      address: "ბათუმი, რუსთაველი",
      addressEn: "Address En",
    });
    createdPartnerIds.push(res._id);

    await page.reload();
    await partnersPage.tabs.pending.click();
    await partnersPage.gotoDetails(name);

    await expect(partnersPage.statusBadge).toHaveText("მოლოდინი");
    await partnersPage.approveBtn.click();
    await expect(page.getByText("წარმატებით")).toBeVisible();
    await expect(partnersPage.statusBadge).toHaveText("დადასტურებული");

    // Verify it moved from Pending to Approved
    await partnersPage.backBtn.click();
    await partnersPage.tabs.approved.click();
    await partnersPage.searchInput.fill(name);
    await page.waitForTimeout(1000);
    await expect(partnersPage.getCardByName(name)).toBeVisible();
  });

  test("AA-005: should ban an approved partner", async ({ asAdmin: page }) => {
    const name = `დასაბლოკი_${Date.now()}`;
    const res = await api.createPartner({
      companyNameGe: name,
      companyNameEn: "To Ban En",
      identificationCode: generateIdCode(),
      phone: generatePhone(),
      contactPerson: "Ban Person",
      city: "kutaisi",
      email: `ban-${Date.now()}@test.com`,
      address: "ქუთაისი, მისამართი",
      addressEn: "Address En",
    });
    createdPartnerIds.push(res._id);

    await page.reload();
    await partnersPage.tabs.pending.click();
    await partnersPage.gotoDetails(name);
    await partnersPage.approveBtn.click();
    await expect(page.getByText("წარმატებით")).toBeVisible();

    await expect(partnersPage.statusBadge).toHaveText("დადასტურებული");
    await partnersPage.banBtn.click();
    await expect(page.getByText("წარმატებით")).toBeVisible();
    await expect(partnersPage.statusBadge).toHaveText("დაბლოკილი");

    // Verify it moved to Banned
    await partnersPage.backBtn.click();
    await partnersPage.tabs.banned.click();
    await partnersPage.searchInput.fill(name);
    await page.waitForTimeout(1000);
    await expect(partnersPage.getCardByName(name)).toBeVisible();
  });

  test("AA-006: should reject (delete) a partner from detailed view", async ({
    asAdmin: page,
  }) => {
    const name = `დასაყოლებელი_${Date.now()}`;
    const res = await api.createPartner({
      companyNameGe: name,
      companyNameEn: "To Reject En",
      identificationCode: generateIdCode(),
      phone: generatePhone(),
      contactPerson: "Reject Person",
      city: "tbilisi",
      email: `reject-${Date.now()}@test.com`,
      address: "თბილისი, მისამართი",
      addressEn: "Address En",
    });
    createdPartnerIds.push(res._id);

    await page.reload();
    await partnersPage.gotoDetails(name);

    // Setup dialog listener for deletion confirmation
    page.on("dialog", (dialog) => dialog.accept());
    await partnersPage.rejectBtn.click();

    await expect(page.getByText("წაშლა ვერ მოხერხდა").or(page.getByText("წარმატებით")).or(page.getByText("წაიშალა"))).toBeVisible();
    await expect(page).toHaveURL(/\/partners/);
    await partnersPage.searchInput.fill(name);
    await page.waitForTimeout(1000);
    await expect(partnersPage.getCardByName(name)).not.toBeVisible();
  });

  /**
   * 🗑️ BULK OPERATIONS
   */
  test("AA-007: should perform bulk delete", async ({ asAdmin: page }) => {
    const p1 = `ბალკი1_${Date.now()}`;
    const p2 = `ბალკი2_${Date.now()}`;
    const r1 = await api.createPartner({
      companyNameGe: p1,
      companyNameEn: "Bulk 1",
      identificationCode: generateIdCode(),
      phone: generatePhone(),
      contactPerson: "B1",
      city: "tbilisi",
      email: `b1-${Date.now()}@test.com`,
      address: "თბილისი, მისამართი",
      addressEn: "Add 1",
    });
    const r2 = await api.createPartner({
      companyNameGe: p2,
      companyNameEn: "Bulk 2",
      identificationCode: generateIdCode(),
      phone: generatePhone(),
      contactPerson: "B2",
      city: "tbilisi",
      email: `b2-${Date.now()}@test.com`,
      address: "თბილისი, მისამართი",
      addressEn: "Add 2",
    });
    createdPartnerIds.push(r1._id, r2._id);

    await page.reload();
    await partnersPage.searchInput.fill("ბალკი");
    await page.waitForTimeout(1000);

    await partnersPage.selectAllCheckbox.click();
    await expect(partnersPage.bulkDeleteBtn).toContainText("წაშლა (2)");

    page.on("dialog", (dialog) => dialog.accept());
    await partnersPage.bulkDeleteBtn.click();

    await expect(page.getByText("წარმატებით").or(page.getByText("წაიშალა"))).toBeVisible();
    await expect(partnersPage.getCardByName(p1)).not.toBeVisible();
    await expect(partnersPage.getCardByName(p2)).not.toBeVisible();
  });

  /**
   * 📊 PAGINATION
   */
  test("AA-008: should navigate through pagination", async () => {
    await partnersPage.tabs.all.click();
    const paginationVisible = await partnersPage.pageInfo.isVisible();
    if (paginationVisible) {
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
