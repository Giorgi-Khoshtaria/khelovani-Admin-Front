/**
 * Assertion helpers for Playwright tests.
 * Import from here when you only need assertion functions (no scenarios/constants).
 */

import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import type { ValidationScenario } from "./validation-constants.helper";

// ─────────────────────────────────────────────────────────────────────────────
// Field / scenario assertions
// ─────────────────────────────────────────────────────────────────────────────

export async function assertFieldError(locator: Locator, message: string) {
  await expect(locator).toContainText(message);
}

export async function assertFieldHasError(locator: Locator) {
  await expect(locator).toBeVisible();
}

export async function assertRequired(locator: Locator) {
  await expect(locator).toContainText("სავალდებულოა");
}

/** Assert any visible .error-text contains the scenario's expected error */
export async function assertScenario(locator: Locator, scenario: ValidationScenario) {
  await expect(locator.filter({ hasText: scenario.expectedError }).first()).toBeVisible({ timeout: 5000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast assertions
// ─────────────────────────────────────────────────────────────────────────────

export async function assertSuccessToast(page: Page, text?: string | RegExp) {
  const toast = page.locator(".Toastify__toast--success").first();
  if (text) await expect(toast).toContainText(text, { timeout: 10000 });
  else await expect(toast).toBeVisible({ timeout: 10000 });
}

export async function assertErrorToast(page: Page, text?: string | RegExp) {
  const toast = page.locator(".Toastify__toast--error").first();
  if (text) await expect(toast).toContainText(text, { timeout: 10000 });
  else await expect(toast).toBeVisible({ timeout: 10000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation / redirect assertions
// ─────────────────────────────────────────────────────────────────────────────

export async function assertStaysOnLogin(page: Page) {
  await expect(page).toHaveURL(/\/login/);
}

export async function assertRedirectedToLogin(page: Page) {
  await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
}

export async function assertRouteBlocked(page: Page, route: string) {
  await page.goto(route);
  await expect(page).not.toHaveURL(new RegExp(`${route}$`), { timeout: 8000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// Security assertions
// ─────────────────────────────────────────────────────────────────────────────

export async function assertNoXssDialog(page: Page, action: () => Promise<void>) {
  let fired = false;
  page.once("dialog", async (d) => { fired = true; await d.dismiss(); });
  await action();
  await page.waitForTimeout(800);
  expect(fired).toBe(false);
}

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────

export function waitForApi(page: Page, urlFragment: string, method?: string) {
  return page.waitForResponse(
    (r) => r.url().includes(urlFragment) && (method ? r.request().method() === method : true),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward-compatible aliases (expect* → assert*)
// ─────────────────────────────────────────────────────────────────────────────

export const expectSuccessToast    = assertSuccessToast;
export const expectErrorToast      = assertErrorToast;
export const expectRedirectToLogin = assertRedirectedToLogin;
export const expectFieldError      = assertFieldError;
export const expectNoXssDialog     = assertNoXssDialog;
export const waitForApiResponse    = waitForApi;
