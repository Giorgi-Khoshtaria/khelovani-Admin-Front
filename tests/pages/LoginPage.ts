import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly errorToast: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.submitButton = page.locator("button.admin-login-btn");
    this.successToast = page.locator(".Toastify__toast--success");
    this.errorToast = page.locator(".Toastify__toast--error");
    this.emailError = page.locator(".form-group:has(#email) .error-text");
    this.passwordError = page.locator(".form-group:has(#password) .error-text");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    if (email !== null) await this.emailInput.fill(email);
    if (password !== null) await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
