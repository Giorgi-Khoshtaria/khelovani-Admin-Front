import { Page, Locator } from "@playwright/test";

interface FillFormOptions {
  titleGe?: string;
  titleEn?: string;
  descriptionGe?: string;
  descriptionEn?: string;
  category?: string;
  price?: number;
  stockQuantity?: number;
  condition?: string;
  tagsGe?: string;
  tagsEn?: string;
  materialsGe?: string;
  materialsEn?: string;
}

export class ProductsPage {
  readonly page: Page;

  // ── Filters ───────────────────────────────────────────────────────────────
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly partnerFilter: Locator;

  // ── List elements ──────────────────────────────────────────────────────────
  readonly productRows: Locator;
  readonly emptyState: Locator;
  readonly addProductBtn: Locator;
  /** Alias for addProductBtn — used by organizer profile product pages. */
  readonly addBtn: Locator;

  // ── Add / Edit form fields ─────────────────────────────────────────────────
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

    this.searchInput    = page.locator("input.filters__input");
    this.categoryFilter = page.locator("select.filters__category");
    this.partnerFilter  = page.locator("select.filters__select");
    this.productRows    = page.locator(".product-row");
    this.emptyState     = page.locator(".empty-state");
    this.addProductBtn  = page.locator(".add-product-btn");
    this.addBtn         = this.addProductBtn;

    this.titleGe        = page.locator('input[name="titleGe"]');
    this.titleEn        = page.locator('input[name="titleEn"]');
    this.descriptionGe  = page.locator('textarea[name="descriptionGe"]');
    this.descriptionEn  = page.locator('textarea[name="descriptionEn"]');
    this.category       = page.locator('select[name="category"]');
    this.price          = page.locator('input[name="price"]');
    this.stockQuantity  = page.locator('input[name="stockQuantity"]');
    this.condition      = page.locator('select[name="condition"]');
    this.saveBtn        = page.locator('button:has-text("შენახვა"), button:has-text("დამატება")').first();
    this.imageInput     = page.locator('input[type="file"]');
    this.tagsGe         = page.locator('input[placeholder*="ტეგი (GE)"]');
    this.tagsEn         = page.locator('input[placeholder*="Tags (EN)"]');
    this.materialsGe    = page.locator('input[placeholder*="მასალა (GE)"]');
    this.materialsEn    = page.locator('input[placeholder*="Materials (EN)"]');
  }

  async goto(partnerId?: string) {
    if (partnerId) {
      await this.page.goto(`/partners/${partnerId}/products`);
    } else {
      await this.page.goto("/products");
    }
  }

  row(titleEn: string) {
    return this.productRows.filter({ hasText: titleEn }).first();
  }

  /** Fills visible form fields. Tags/materials use fill+Enter (chip input). */
  async fillForm(opts: FillFormOptions) {
    if (opts.titleGe !== undefined)        await this.titleGe.fill(opts.titleGe);
    if (opts.titleEn !== undefined)        await this.titleEn.fill(opts.titleEn);
    if (opts.descriptionGe !== undefined)  await this.descriptionGe.fill(opts.descriptionGe);
    if (opts.descriptionEn !== undefined)  await this.descriptionEn.fill(opts.descriptionEn);
    if (opts.category !== undefined)       await this.category.selectOption(opts.category);
    if (opts.price !== undefined)          await this.price.fill(String(opts.price));
    if (opts.stockQuantity !== undefined)  await this.stockQuantity.fill(String(opts.stockQuantity));
    if (opts.condition !== undefined)      await this.condition.selectOption(opts.condition);
    if (opts.tagsGe !== undefined) {
      await this.tagsGe.fill(opts.tagsGe);
    }
    if (opts.tagsEn !== undefined) {
      await this.tagsEn.fill(opts.tagsEn);
    }
    if (opts.materialsGe !== undefined) {
      await this.materialsGe.fill(opts.materialsGe);
    }
    if (opts.materialsEn !== undefined) {
      await this.materialsEn.fill(opts.materialsEn);
    }
  }
}
