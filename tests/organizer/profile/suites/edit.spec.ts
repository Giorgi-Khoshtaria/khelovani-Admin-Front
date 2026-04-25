import { test, expect } from "../../../fixtures/auth.fixture";
import { PartnersPage } from "../../../pages/PartnersPage";
import {
  assertSuccessToast,
  waitForApi,
} from "../../../helpers/validation-assertions.helper";

const geoSuffix = () => {
  const map: Record<string, string> = {
    "0": "ა",
    "1": "ბ",
    "2": "გ",
    "3": "დ",
    "4": "ე",
    "5": "ვ",
    "6": "ზ",
    "7": "თ",
    "8": "ი",
    "9": "კ",
  };
  return Date.now()
    .toString()
    .slice(-4)
    .split("")
    .map((d) => map[d] ?? "ა")
    .join("");
};

export const editProfileTests = () => {
  test.describe("Edit", () => {
    test.describe.configure({ mode: "serial" });
    let profile: PartnersPage;

    test.beforeEach(async ({ asOrganizer: page }) => {
      profile = new PartnersPage(page);
      await profile.gotoProfile();
      await profile.openEdit();
    });

    test("save fires PATCH /api/admin/partners/:id", async ({
      asOrganizer: page,
    }) => {
      const patchPromise = waitForApi(page, "/api/admin/partners/", "PATCH");
      await profile.save();
      const response = await patchPromise;
      expect(response.status()).toBe(200);
    });

    test("update company name (GE) → success toast + persists after reload", async ({
      asOrganizer: page,
    }) => {
      const newName = `ორგანიზაცია ${geoSuffix()}`;
      await profile.companyNameGe.fill(newName);
      await profile.save();
      await assertSuccessToast(page);
      await page.reload();
      await profile.openEdit();
      await expect(profile.companyNameGe).toHaveValue(newName);
    });

    test("update phone → success toast + persists after reload", async ({
      asOrganizer: page,
    }) => {
      const newPhone = `5${Date.now().toString().slice(-8)}`;
      await profile.phone.fill(newPhone);
      await profile.save();
      await assertSuccessToast(page);
      await page.reload();
      await profile.openEdit();
      await expect(profile.phone).toHaveValue(newPhone);
    });

    test("update address → success toast + persists after reload", async () => {
      const newAddress = `ქუჩა ${geoSuffix()}`;
      await profile.address.fill(newAddress);
      await profile.save();
      await assertSuccessToast(profile.page);
      await profile.page.reload();
      await profile.openEdit();
      await expect(profile.address).toHaveValue(newAddress);
    });

    test("cancel discards pending changes", async ({ asOrganizer: page }) => {
      const original = await profile.companyNameGe.inputValue();
      await profile.companyNameGe.fill("temporary-value-xyz");
      await profile.cancel();
      // edit form closes
      await expect(profile.saveBtn).not.toBeVisible();
      // re-open and value is unchanged
      await profile.openEdit();
      await expect(profile.companyNameGe).toHaveValue(original);
    });
  });
};
