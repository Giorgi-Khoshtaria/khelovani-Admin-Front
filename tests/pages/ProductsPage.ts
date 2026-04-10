import { Page, Locator } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly addBtn: Locator;
  readonly titleGe: Locator;
  readonly titleEn: Locator;
  readonly descriptionGe: Locator;
  readonly descriptionEn: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly stockQuantity: Locator;
  readonly condition: Locator;
  readonly saveBtn: Locator;
  readonly imageInput: Locator;
  readonly tagsGe: Locator;
  readonly tagsEn: Locator;
  readonly materialsGe: Locator;
  readonly materialsEn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addBtn = page.getByRole("link", { name: /ახალი|პროდუქტის დამატება/i }).or(page.getByRole("button", { name: /ახალი|პროდუქტის დამატება/i }));
    this.titleGe = page.locator('input[name="titleGe"]');
    this.titleEn = page.locator('input[name="titleEn"]');
    this.descriptionGe = page.locator('textarea[name="descriptionGe"]');
    this.descriptionEn = page.locator('textarea[name="descriptionEn"]');
    this.category = page.locator('select[name="category"]');
    this.price = page.locator('input[name="price"]');
    this.stockQuantity = page.locator('input[name="stockQuantity"]');
    this.condition = page.locator('select[name="condition"]');
    this.saveBtn = page.locator('button:has-text("შენახვა"), button:has-text("დამატება")').first();
    this.imageInput = page.locator('input[type="file"]');
    
    this.tagsGe = page.locator('label:has-text("ტეგები (GE)") + input, input[placeholder*="ტეგი (GE)"]');
    this.tagsEn = page.locator('label:has-text("ტეგები (EN)") + input, input[placeholder*="Tags (EN)"]');
    this.materialsGe = page.locator('label:has-text("მასალები (GE)") + input, input[placeholder*="მასალა (GE)"]');
    this.materialsEn = page.locator('label:has-text("მასალები (EN)") + input, input[placeholder*="Materials (EN)"]');
  }

  async goto(partnerId?: string) {
    if (partnerId) {
      await this.page.goto(`/partners/${partnerId}/products`);
    } else {
      await this.page.goto("/products");
    }
  }

  async fillForm(data: { 
    titleGe?: string; 
    titleEn?: string; 
    descriptionGe?: string; 
    descriptionEn?: string; 
    category?: string; 
    price?: number; 
    stockQuantity?: number; 
    condition?: string; 
    shippingAvailable?: boolean;
    shippingPrice?: number;
    locationGe?: string;
    locationEn?: string;
    dimensions?: string;
    weight?: number;
    tagsGe?: string; 
    tagsEn?: string;
    materialsGe?: string;
    materialsEn?: string;
  }) {
    if (data.titleGe) await this.titleGe.fill(data.titleGe);
    if (data.titleEn) await this.titleEn.fill(data.titleEn);
    if (data.descriptionGe) await this.descriptionGe.fill(data.descriptionGe);
    if (data.descriptionEn) await this.descriptionEn.fill(data.descriptionEn);
    if (data.locationGe) await this.page.locator('input[name="locationGe"]').fill(data.locationGe);
    if (data.locationEn) await this.page.locator('input[name="locationEn"]').fill(data.locationEn);
    if (data.category) await this.category.selectOption(data.category);
    if (data.price !== undefined) await this.price.fill(data.price.toString());
    if (data.stockQuantity !== undefined) await this.stockQuantity.fill(data.stockQuantity.toString());
    if (data.condition) await this.condition.selectOption(data.condition.toLowerCase());
    
    if (data.shippingAvailable !== undefined) {
      const checkbox = this.page.locator('input[name="shippingAvailable"]');
      if (await checkbox.isChecked() !== data.shippingAvailable) {
        await checkbox.click();
      }
    }
    if (data.shippingPrice !== undefined) await this.page.locator('input[name="shippingPrice"]').fill(data.shippingPrice.toString());
    if (data.dimensions) await this.page.locator('input[name="dimensions"]').fill(data.dimensions);
    if (data.weight !== undefined) await this.page.locator('input[name="weight"]').fill(data.weight.toString());

    if (data.tagsGe) {
      await this.tagsGe.fill(data.tagsGe);
    }
    if (data.tagsEn) {
      await this.tagsEn.fill(data.tagsEn);
    }
    if (data.materialsGe) {
      await this.materialsGe.fill(data.materialsGe);
    }
    if (data.materialsEn) {
      await this.materialsEn.fill(data.materialsEn);
    }
  }
}
