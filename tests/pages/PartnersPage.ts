import { Page, Locator } from "@playwright/test";

export class PartnersPage {
  readonly page: Page;
  
  // Listing Page Locators
  readonly searchInput: Locator;
  readonly tabs: {
    all: Locator;
    pending: Locator;
    approved: Locator;
    banned: Locator;
  };
  readonly partnerCards: Locator;
  readonly selectAllCheckbox: Locator;
  readonly bulkDeleteBtn: Locator;
  readonly prevPageBtn: Locator;
  readonly nextPageBtn: Locator;
  readonly pageInfo: Locator;

  // Detailed View Locators (from PartnerHeader and PartnerInfoGrid)
  readonly backBtn: Locator;
  readonly editBtn: Locator;
  readonly approveBtn: Locator;
  readonly rejectBtn: Locator;
  readonly banBtn: Locator;
  readonly statusBadge: Locator;

  // Profile / Edit Form Locators
  readonly companyNameGe: Locator;
  readonly companyNameEn: Locator;
  readonly contactPerson: Locator;
  readonly city: Locator;
  readonly phone: Locator;
  readonly email: Locator;
  readonly address: Locator;
  readonly addressEn: Locator;
  readonly website: Locator;
  readonly facebook: Locator;
  readonly instagram: Locator;
  readonly tiktok: Locator;
  readonly description: Locator;
  readonly descriptionEn: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;
  readonly errorText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Listing
    this.searchInput = page.locator('input[placeholder*="ძებნა კომპანიის სახელით ან მეილით"]');
    this.tabs = {
      all: page.locator(".tabs button:has-text('ყველა')"),
      pending: page.locator(".tabs button:has-text('მოლოდინი')"),
      approved: page.locator(".tabs button:has-text('დადასტურებული')"),
      banned: page.locator(".tabs button:has-text('დაბლოკილი')"),
    };
    this.partnerCards = page.locator(".partner-card");
    this.selectAllCheckbox = page.locator(".select-all input[type='checkbox']");
    this.bulkDeleteBtn = page.locator(".bulk-delete-btn");
    this.prevPageBtn = page.locator(".pagination button:has-text('წინა')");
    this.nextPageBtn = page.locator(".pagination button:has-text('შემდეგი')");
    this.pageInfo = page.locator(".page-info");

    // Detailed
    this.backBtn = page.locator(".back-btn");
    this.editBtn = page.locator(".edit-btn");
    this.approveBtn = page.locator(".profile-header .approve-btn");
    this.rejectBtn = page.locator(".profile-header .reject-btn");
    this.banBtn = page.locator(".profile-header .ban-btn");
    this.statusBadge = page.locator(".profile-header .status-badge").first();

    // Profile / Edit Form Inputs (visible only in edit mode)
    this.companyNameGe  = page.locator('#companyNameGe');
    this.companyNameEn  = page.locator('#companyNameEn');
    this.contactPerson  = page.locator('#contactPerson');
    this.city           = page.locator('#city');
    this.phone          = page.locator('#phone');
    this.email          = page.locator('#email');
    this.address        = page.locator('#address');
    this.addressEn      = page.locator('#addressEn');
    this.website        = page.locator('#website');
    this.facebook       = page.locator('#facebook');
    this.instagram      = page.locator('#instagram');
    this.tiktok         = page.locator('#tiktok');
    this.description    = page.locator('#description');
    this.descriptionEn  = page.locator('#descriptionEn');
    this.saveBtn        = page.locator('button.save-btn');
    this.cancelBtn      = page.locator('button.cancel-btn');
    this.errorText      = page.locator('.error-text');
  }

  async goto() {
    await this.page.goto("/partners");
  }

  async gotoProfile() {
    await this.page.goto("/profile");
  }

  async openEdit() {
    await this.editBtn.click();
  }

  async save() {
    await this.saveBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }

  getCardByName(name: string) {
    return this.page.locator(`.partner-card:has-text("${name}")`);
  }

  async gotoDetails(name: string) {
    await this.searchInput.fill(name);
    await this.page.waitForResponse((r) => r.url().includes("/api/admin/partners"));
    const card = this.getCardByName(name);
    await card.locator(".view-details-btn").click();
    await this.page.waitForURL(/\/partners\/[a-f0-9]+/);
  }

  getDetailedField(id: string) {
    return this.page.locator(`#${id}`);
  }
}
