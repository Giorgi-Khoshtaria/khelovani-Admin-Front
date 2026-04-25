import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";
import {
  partnerPhoneScenarios,
  partnerCompanyNameGeScenarios,
  partnerCompanyNameEnScenarios,
  partnerEmailScenarios,
  partnerContactPersonScenarios,
  partnerAddressScenarios,
  assertScenario,
} from "../../../helpers/validation-scenarios.helper";

export const validationTests = () => {
  test.describe("Validation", () => {
    let profile: PartnersPage;

    test.beforeEach(async ({ asOrganizer: page }) => {
      profile = new PartnersPage(page);
      await profile.gotoProfile();
      await profile.openEdit();
    });

    const scenarios: {
      label: string;
      getField: (p: PartnersPage) => import("@playwright/test").Locator;
      cases: typeof partnerPhoneScenarios;
    }[] = [
      { label: "companyNameGe", getField: (p) => p.companyNameGe, cases: partnerCompanyNameGeScenarios },
      { label: "companyNameEn", getField: (p) => p.companyNameEn, cases: partnerCompanyNameEnScenarios },
      { label: "phone",         getField: (p) => p.phone,         cases: partnerPhoneScenarios },
      { label: "email",         getField: (p) => p.email,         cases: partnerEmailScenarios },
      { label: "contactPerson", getField: (p) => p.contactPerson, cases: partnerContactPersonScenarios },
      { label: "address",       getField: (p) => p.address,       cases: partnerAddressScenarios.filter((s) => s.field === "address") },
      { label: "addressEn",     getField: (p) => p.addressEn,     cases: partnerAddressScenarios.filter((s) => s.field === "addressEn") },
    ];

    for (const { label, getField, cases } of scenarios) {
      for (const s of cases) {
        test(`${s.id} — ${label}: ${s.note}`, async ({ asOrganizer: page }) => {
          await getField(profile).clear();
          await getField(profile).fill(s.value);
          await profile.save();
          await assertScenario(profile.errorText, s);
        });
      }
    }

    test("clear multiple required fields → at least one error shown", async ({
      asOrganizer: page,
    }) => {
      await profile.phone.clear();
      await profile.companyNameGe.clear();
      await profile.save();
      await expect(profile.errorText.first()).toBeVisible({ timeout: 5000 });
    });
  });
};
