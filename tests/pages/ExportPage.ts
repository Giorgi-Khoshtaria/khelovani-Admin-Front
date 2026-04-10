import { Page, Locator } from "@playwright/test";

export class ExportPage {
  readonly page: Page;
  readonly header: Locator;
  readonly exportButtons: {
    translations: Locator;
    roles: Locator;
    permissions: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("h1:has-text('მონაცემების ექსპორტი')");
    this.exportButtons = {
      translations: page.locator(".export-translations-btn"),
      roles: page.locator(".export-roles-btn"),
      permissions: page.locator(".export-permissions-btn"),
    };
  }

  async goto() {
    await this.page.goto("/export");
  }
}
