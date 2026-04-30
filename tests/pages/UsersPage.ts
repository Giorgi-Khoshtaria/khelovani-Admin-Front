import { Page, Locator, expect } from "@playwright/test";

export class UsersPage {
  readonly page: Page;

  readonly searchInput: Locator;
  readonly dateFromInput: Locator;
  readonly dateToInput: Locator;
  readonly clearFiltersBtn: Locator;
  readonly userRows: Locator;
  readonly emptyState: Locator;
  readonly countBadge: Locator;
  readonly selectAllCheckbox: Locator;
  readonly bulkToolbar: Locator;
  readonly bulkDeleteBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="user-search-input"]');
    this.dateFromInput = page.locator('[data-testid="user-date-from"]');
    this.dateToInput = page.locator('[data-testid="user-date-to"]');
    this.clearFiltersBtn = page.locator('[data-testid="user-clear-filters"]');
    this.userRows = page.locator('[data-testid="user-row"]');
    this.emptyState = page.locator(".empty-state");
    this.countBadge = page.locator(".count-badge");
    this.selectAllCheckbox = page.locator('[data-testid="select-all-checkbox"]');
    this.bulkToolbar = page.locator('[data-testid="bulk-toolbar"]');
    this.bulkDeleteBtn = page.locator('[data-testid="bulk-delete-btn"]');
  }

  async goto() {
    await this.page.goto("/users");
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(600);
  }

  async filterByDateRange(from: string, to: string) {
    if (from) await this.dateFromInput.fill(from);
    if (to) await this.dateToInput.fill(to);
    await this.page.waitForTimeout(400);
  }

  getRowById(userId: string) {
    return this.userRows.filter({ hasText: userId }).first();
  }

  getRowByEmail(email: string) {
    return this.userRows.filter({ hasText: email }).first();
  }

  getRowCheckbox(row: Locator) {
    return row.locator('[data-testid="user-row-checkbox"]');
  }

  async clickRow(userId: string) {
    await this.getRowById(userId).click();
  }

  async deleteRow(row: Locator) {
    await row.locator('[data-testid="user-delete-btn"]').click();
  }

  async expectRowVisible(userId: string) {
    await expect(this.getRowById(userId)).toBeVisible();
  }

  async expectCount(min: number) {
    await expect(this.countBadge).toBeVisible();
    const text = await this.countBadge.textContent();
    expect(Number(text?.trim())).toBeGreaterThanOrEqual(min);
  }
}
