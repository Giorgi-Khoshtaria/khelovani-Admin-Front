import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { CreateProductInput } from "../../src/types/productTypes";
import { ApiHelper } from "./api.helper";

export const buildProductData = (
  overrides?: Partial<CreateProductInput>,
): Partial<CreateProductInput> => ({
  titleGe: "ტესტი",
  titleEn: `Test_${Date.now()}`,
  descriptionGe: "ტესტის სატესტო აღწერა გამოიყენება",
  descriptionEn: "Test product description for testing",
  category: "other",
  price: 15,
  stockQuantity: 1,
  condition: "new",
  currency: "GEL",
  tagsGe: ["ტეგი"],
  tagsEn: ["tag"],
  materialsGe: ["მასალა"],
  materialsEn: ["material"],
  isShown: true,
  isOneOfAKind: false,
  shippingAvailable: true,
  shippingPrice: 0,
  locationGe: "თბილისი",
  locationEn: "Tbilisi",
  ...overrides,
});

/** Creates a product via API and returns { ...data, id }. */
export const createTestProduct = async (
  api: ApiHelper,
  partnerId: string,
  overrides?: Partial<CreateProductInput>,
) => {
  const data = buildProductData(overrides);
  const res  = await api.createProduct(partnerId, data);
  const id   = res._id ?? res.data?._id ?? res.product?._id;
  return { ...data, id } as typeof data & { id: string };
};

/** Fills the search input and waits for the search API response. */
export const searchProduct = async (page: Page, titleEn: string) => {
  const searchInput = page.locator("input.filters__input");
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes("/api/products") && r.request().method() === "GET",
  );
  await searchInput.fill(titleEn);
  await responsePromise;
  return page.locator(".product-row").filter({ hasText: titleEn }).first();
};

/**
 * Creates a product via API, reloads the listing page, searches for it,
 * clicks the row, and waits for the details page to appear.
 * Returns { ...data, id }.
 */
export const createAndNavigateToProductDetails = async (
  page: Page,
  api: ApiHelper,
  partnerId: string,
  overrides?: Partial<CreateProductInput>,
) => {
  const data = buildProductData({
    titleEn: `Details_${Date.now()}`,
    ...overrides,
  });

  const res = await api.createProduct(partnerId, data);
  const id  = res._id ?? res.data?._id ?? res.product?._id;

  // Register before reload so we capture the initial products GET
  const initialLoadPromise = page.waitForResponse(
    (r) => r.url().includes("/api/products") && r.request().method() === "GET",
  );
  await page.reload();
  await initialLoadPromise;

  const row = await searchProduct(page, data.titleEn!);
  await expect(row).toBeVisible();
  await row.click();
  await expect(page.locator(".product-details-page")).toBeVisible({ timeout: 8000 });

  return { ...data, id } as typeof data & { id: string };
};
