import { Page, Locator } from "@playwright/test";

export class RolesPage {
  readonly page: Page;
  readonly rolesTab: Locator;
  readonly permissionsTab: Locator;
  readonly newRoleBtn: Locator;
  readonly newPermissionBtn: Locator;
  readonly searchInput: Locator;
  readonly roleName: Locator;
  readonly roleDesc: Locator;
  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rolesTab = page.locator(".tab-item:has-text('როლები')");
    this.permissionsTab = page.locator(".tab-item:has-text('უფლებების სია')");
    this.newRoleBtn = page.getByRole("button", { name: "+ ახალი როლი" });
    this.newPermissionBtn = page.getByRole("button", { name: "+ ახალი უფლება" });
    this.roleName = page.locator("#name");
    this.roleDesc = page.locator("#description");
    this.saveBtn = page.locator('button:has-text("შენახვა")');
    this.searchInput = page.locator('input[placeholder*="მოძებნე"]');
  }

  async goto() {
    await this.page.goto("/roles");
  }
}
