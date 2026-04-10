import { Page, Locator } from "@playwright/test";

export class MenuPage {
  readonly page: Page;
  readonly addBtn: Locator;
  readonly modal: Locator;
  readonly labelKa: Locator;
  readonly labelEn: Locator;
  readonly href: Locator;
  readonly order: Locator;
  readonly saveBtn: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addBtn = page.locator('.btn-primary:has-text("დამატება")');
    this.modal = page.locator(".modal-content");
    this.labelKa = page.locator('input[name="labelKa"]');
    this.labelEn = page.locator('input[name="labelEn"]');
    this.href = page.locator('input[name="href"]');
    this.order = page.locator('input[name="order"]');
    this.isActiveCheckbox = page.locator('input[name="isActive"]');
    this.saveBtn = page.locator('button[type="submit"]:has-text("შენახვა")');
    this.cancelBtn = page.locator('button.btn-outline:has-text("გაუქმება")');
    this.modalOverlay = page.locator(".modal-overlay");
    this.tableRows = page.locator(".menu-table tbody tr");
    this.emptyState = page.locator(".empty-state, .empty-row");
  }

  readonly isActiveCheckbox: Locator;
  readonly cancelBtn: Locator;
  readonly modalOverlay: Locator;
  readonly emptyState: Locator;

  async goto() {
    await this.page.goto("/menu");
  }

  getErrorLocator(fieldName: string) {
    return this.page.getByTestId(`error-${fieldName}`);
  }

  getRowByText(text: string) {
    return this.tableRows.filter({ hasText: text });
  }

  async createMenuItem(data: {
    labelKa: string;
    labelEn: string;
    href: string;
    order: number;
    isActive?: boolean;
  }) {
    await this.addBtn.click();
    await this.fillForm(data);
    await this.saveBtn.click();
  }

  async fillForm(data: {
    labelKa?: string;
    labelEn?: string;
    href?: string;
    order?: number;
    isActive?: boolean;
  }) {
    if (data.labelKa !== undefined) await this.labelKa.fill(data.labelKa);
    if (data.labelEn !== undefined) await this.labelEn.fill(data.labelEn);
    if (data.href !== undefined) await this.href.fill(data.href);
    if (data.order !== undefined) await this.order.fill(data.order.toString());
    if (data.isActive !== undefined) {
      const isChecked = await this.isActiveCheckbox.isChecked();
      if (isChecked !== data.isActive) {
        await this.isActiveCheckbox.click();
      }
    }
  }

  async getOrders(): Promise<number[]> {
    const rows = await this.tableRows.all();
    const orders = await Promise.all(
      rows.map(async (row) => {
        const text = await row.locator("td").first().innerText();
        return Number(text);
      }),
    );
    return orders;
  }

  async submitViaEnter() {
    await this.page.keyboard.press("Enter");
  }
}
