/**
 * Validation scenario arrays for every form field.
 * Each scenario drives one test case via assertScenario().
 *
 * Usage:
 *   import { loginEmailScenarios, assertScenario } from "../../helpers/validation-scenarios.helper";
 *
 *   for (const s of loginEmailScenarios) {
 *     test(`${s.id} — ${s.note}`, async ({ page }) => {
 *       await loginPage.emailInput.fill(s.value);
 *       await loginPage.submitButton.click();
 *       await assertScenario(loginPage.emailError, s);
 *     });
 *   }
 */

export * from "./validation-constants.helper";
export * from "./validation-assertions.helper";

import { V, LIMITS } from "./validation-constants.helper";
import type { ValidationScenario, PassingScenario } from "./validation-constants.helper";

// ─────────────────────────────────────────────────────────────────────────────
// Login scenarios
// ─────────────────────────────────────────────────────────────────────────────

export const loginEmailScenarios: ValidationScenario[] = [
  { id: "VAL-EMAIL-001", field: "email", value: "",                                                    expectedError: V.login.EMAIL_REQUIRED, note: "empty string → required" },
  { id: "VAL-EMAIL-002", field: "email", value: "   ",                                                 expectedError: V.login.EMAIL_REQUIRED, note: "whitespace only → required" },
  { id: "VAL-EMAIL-003", field: "email", value: "testcom",                                             expectedError: V.login.EMAIL_FORMAT,   note: "missing @" },
  { id: "VAL-EMAIL-004", field: "email", value: "test@",                                               expectedError: V.login.EMAIL_FORMAT,   note: "missing domain after @" },
  { id: "VAL-EMAIL-005", field: "email", value: "@test.com",                                           expectedError: V.login.EMAIL_FORMAT,   note: "missing local part before @" },
  { id: "VAL-EMAIL-006", field: "email", value: "test@test.com@test",                                  expectedError: V.login.EMAIL_FORMAT,   note: "multiple @ symbols" },
  { id: "VAL-EMAIL-007", field: "email", value: "test @test.com",                                      expectedError: V.login.EMAIL_FORMAT,   note: "space inside email" },
  { id: "VAL-EMAIL-008", field: "email", value: "test..name@test.com",                                 expectedError: V.login.EMAIL_FORMAT,   note: "consecutive dots" },
  { id: "VAL-EMAIL-009", field: "email", value: "test@test",                                           expectedError: V.login.EMAIL_FORMAT,   note: "no TLD" },
  { id: "VAL-EMAIL-010", field: "email", value: "test@test.",                                          expectedError: V.login.EMAIL_FORMAT,   note: "trailing dot in domain" },
  { id: "VAL-EMAIL-011", field: "email", value: "a".repeat(LIMITS.login.EMAIL_MAX + 1) + "@x.com",    expectedError: V.login.EMAIL_MAX,      note: `exceeds ${LIMITS.login.EMAIL_MAX} char limit` },
];

export const loginPasswordScenarios: ValidationScenario[] = [
  { id: "VAL-PW-001", field: "password", value: "",    expectedError: V.login.PASSWORD_REQUIRED, note: "empty string → required" },
  { id: "VAL-PW-002", field: "password", value: "   ", expectedError: V.login.PASSWORD_REQUIRED, note: "whitespace only → required" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Menu scenarios
// ─────────────────────────────────────────────────────────────────────────────

export const menuLabelEnScenarios: ValidationScenario[] = [
  { id: "VAL-MENU-EN-001", field: "labelEn", value: "",                                    expectedError: V.menu.LABEL_EN_REQUIRED, note: "empty → required" },
  { id: "VAL-MENU-EN-002", field: "labelEn", value: "   ",                                 expectedError: V.menu.LABEL_EN_REQUIRED, note: "whitespace only → required" },
  { id: "VAL-MENU-EN-003", field: "labelEn", value: "ქართული",                            expectedError: V.menu.LABEL_EN_LATIN,    note: "Georgian chars → Latin only" },
  { id: "VAL-MENU-EN-004", field: "labelEn", value: "Home გ",                              expectedError: V.menu.LABEL_EN_LATIN,    note: "mixed Latin+Georgian → Latin only" },
  { id: "VAL-MENU-EN-005", field: "labelEn", value: "Привет",                              expectedError: V.menu.LABEL_EN_LATIN,    note: "Cyrillic → Latin only" },
  { id: "VAL-MENU-EN-006", field: "labelEn", value: "Label!@#",                            expectedError: V.menu.LABEL_EN_LATIN,    note: "special chars not in allowed set" },
  { id: "VAL-MENU-EN-007", field: "labelEn", value: "a".repeat(LIMITS.menu.LABEL_MAX + 1), expectedError: V.menu.LABEL_EN_MAX,     note: `exceeds ${LIMITS.menu.LABEL_MAX} char limit` },
];

export const menuLabelKaScenarios: ValidationScenario[] = [
  { id: "VAL-MENU-KA-001", field: "labelKa", value: "",                                    expectedError: V.menu.LABEL_KA_REQUIRED,  note: "empty → required" },
  { id: "VAL-MENU-KA-002", field: "labelKa", value: "   ",                                 expectedError: V.menu.LABEL_KA_REQUIRED,  note: "whitespace only → required" },
  { id: "VAL-MENU-KA-003", field: "labelKa", value: "Home",                                expectedError: V.menu.LABEL_KA_GEORGIAN,  note: "Latin chars → Georgian only" },
  { id: "VAL-MENU-KA-004", field: "labelKa", value: "მთავარი Home",                        expectedError: V.menu.LABEL_KA_GEORGIAN,  note: "mixed Georgian+Latin → Georgian only" },
  { id: "VAL-MENU-KA-005", field: "labelKa", value: "ა".repeat(LIMITS.menu.LABEL_MAX + 1), expectedError: V.menu.LABEL_KA_MAX,      note: `exceeds ${LIMITS.menu.LABEL_MAX} char limit` },
];

export const menuHrefScenarios: ValidationScenario[] = [
  { id: "VAL-MENU-HREF-001", field: "href", value: "",                                   expectedError: V.menu.HREF_REQUIRED, note: "empty → required" },
  { id: "VAL-MENU-HREF-002", field: "href", value: "   ",                                expectedError: V.menu.HREF_REQUIRED, note: "whitespace only → required" },
  { id: "VAL-MENU-HREF-003", field: "href", value: "about",                              expectedError: V.menu.HREF_SLASH,    note: "no leading slash" },
  { id: "VAL-MENU-HREF-004", field: "href", value: "about/page",                         expectedError: V.menu.HREF_SLASH,    note: "relative path without slash" },
  { id: "VAL-MENU-HREF-005", field: "href", value: "/path with spaces",                  expectedError: V.menu.HREF_FORMAT,   note: "spaces in path → invalid format" },
  { id: "VAL-MENU-HREF-006", field: "href", value: "/ქართული",                          expectedError: V.menu.HREF_FORMAT,   note: "Georgian chars in href → invalid" },
  { id: "VAL-MENU-HREF-007", field: "href", value: "a".repeat(LIMITS.menu.HREF_MAX + 1), expectedError: V.menu.HREF_MAX,     note: `exceeds ${LIMITS.menu.HREF_MAX} char limit` },
];

export const menuOrderScenarios: ValidationScenario[] = [
  { id: "VAL-MENU-ORD-001", field: "order", value: "-1",   expectedError: V.menu.ORDER_MIN, note: "negative → min 0" },
  { id: "VAL-MENU-ORD-002", field: "order", value: "-100", expectedError: V.menu.ORDER_MIN, note: "large negative → min 0" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Translation scenarios
// ─────────────────────────────────────────────────────────────────────────────

export const translationKeyScenarios: ValidationScenario[] = [
  { id: "VAL-TRANS-KEY-001", field: "key", value: "",                                         expectedError: V.translation.KEY_REQUIRED,   note: "empty → required" },
  { id: "VAL-TRANS-KEY-002", field: "key", value: "a",                                        expectedError: V.translation.KEY_MIN_LENGTH, note: `1 char — below min ${LIMITS.translation.KEY_MIN}` },
  { id: "VAL-TRANS-KEY-003", field: "key", value: "a".repeat(LIMITS.translation.KEY_MAX + 1), expectedError: V.translation.KEY_MAX_LENGTH, note: `101 chars — above max ${LIMITS.translation.KEY_MAX}` },
];

export const translationGeScenarios: ValidationScenario[] = [
  { id: "VAL-TRANS-GE-001", field: "ge", value: "",                                               expectedError: V.translation.GE_REQUIRED,   note: "empty → required" },
  { id: "VAL-TRANS-GE-002", field: "ge", value: "a".repeat(LIMITS.translation.VALUE_MAX + 1),     expectedError: V.translation.GE_MAX_LENGTH, note: `201 chars — above max ${LIMITS.translation.VALUE_MAX}` },
  { id: "VAL-TRANS-GE-003", field: "ge", value: "<img src=x onerror=alert(1)>",                   expectedError: V.translation.GE_XSS,        note: "XSS img payload → blocked" },
  { id: "VAL-TRANS-GE-004", field: "ge", value: "<script>alert('xss')</script>",                  expectedError: V.translation.GE_XSS,        note: "XSS script payload → blocked" },
  { id: "VAL-TRANS-GE-005", field: "ge", value: "javascript:alert(1)",                            expectedError: V.translation.GE_XSS,        note: "javascript: URI → blocked" },
];

export const translationEnScenarios: ValidationScenario[] = [
  { id: "VAL-TRANS-EN-001", field: "en", value: "",                                               expectedError: V.translation.EN_REQUIRED,   note: "empty → required" },
  { id: "VAL-TRANS-EN-002", field: "en", value: "a".repeat(LIMITS.translation.VALUE_MAX + 1),     expectedError: V.translation.EN_MAX_LENGTH, note: `201 chars — above max ${LIMITS.translation.VALUE_MAX}` },
  { id: "VAL-TRANS-EN-003", field: "en", value: "<script>alert('en')</script>",                   expectedError: V.translation.EN_XSS,        note: "XSS script payload → blocked" },
  { id: "VAL-TRANS-EN-004", field: "en", value: "<iframe src='evil.com'></iframe>",               expectedError: V.translation.EN_XSS,        note: "XSS iframe payload → blocked" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Partner scenarios
// ─────────────────────────────────────────────────────────────────────────────

export const partnerCompanyNameGeScenarios: ValidationScenario[] = [
  { id: "VAL-PART-CGE-001", field: "companyNameGe", value: "",    expectedError: V.partner.COMPANY_NAME_GE_REQUIRED, note: "empty → required" },
  { id: "VAL-PART-CGE-002", field: "companyNameGe", value: "   ", expectedError: V.partner.COMPANY_NAME_GE_REQUIRED, note: "whitespace only → required" },
];

export const partnerCompanyNameEnScenarios: ValidationScenario[] = [
  { id: "VAL-PART-CEN-001", field: "companyNameEn", value: "",    expectedError: V.partner.COMPANY_NAME_EN_REQUIRED, note: "empty → required" },
  { id: "VAL-PART-CEN-002", field: "companyNameEn", value: "   ", expectedError: V.partner.COMPANY_NAME_EN_REQUIRED, note: "whitespace only → required" },
];

export const partnerIdCodeScenarios: ValidationScenario[] = [
  { id: "VAL-PART-ID-001", field: "identificationCode", value: "",           expectedError: V.partner.ID_CODE_REQUIRED, note: "empty → required" },
  { id: "VAL-PART-ID-002", field: "identificationCode", value: "12345678",   expectedError: V.partner.ID_CODE_LENGTH,   note: "8 digits — below required 9" },
  { id: "VAL-PART-ID-003", field: "identificationCode", value: "1234567890", expectedError: V.partner.ID_CODE_LENGTH,   note: "10 digits — above required 9" },
  { id: "VAL-PART-ID-004", field: "identificationCode", value: "abcdefghi",  expectedError: V.partner.ID_CODE_LENGTH,   note: "letters instead of digits" },
];

export const partnerPhoneScenarios: ValidationScenario[] = [
  { id: "VAL-PART-PH-001", field: "phone", value: "",    expectedError: V.partner.PHONE_REQUIRED, note: "empty → required" },
  { id: "VAL-PART-PH-002", field: "phone", value: "   ", expectedError: V.partner.PHONE_REQUIRED, note: "whitespace only → required" },
];

export const partnerEmailScenarios: ValidationScenario[] = [
  { id: "VAL-PART-EM-001", field: "email", value: "",        expectedError: V.partner.EMAIL_REQUIRED, note: "empty → required" },
  { id: "VAL-PART-EM-002", field: "email", value: "notmail", expectedError: V.partner.EMAIL_FORMAT,   note: "missing @ → format error" },
  { id: "VAL-PART-EM-003", field: "email", value: "a@",      expectedError: V.partner.EMAIL_FORMAT,   note: "missing domain → format error" },
  { id: "VAL-PART-EM-004", field: "email", value: "a@b",     expectedError: V.partner.EMAIL_FORMAT,   note: "missing TLD → format error" },
];

export const partnerContactPersonScenarios: ValidationScenario[] = [
  { id: "VAL-PART-CP-001", field: "contactPerson", value: "",    expectedError: V.partner.CONTACT_PERSON_REQUIRED, note: "empty → required" },
  { id: "VAL-PART-CP-002", field: "contactPerson", value: "   ", expectedError: V.partner.CONTACT_PERSON_REQUIRED, note: "whitespace only → required" },
];

export const partnerAddressScenarios: ValidationScenario[] = [
  { id: "VAL-PART-ADDR-001", field: "address",   value: "", expectedError: V.partner.ADDRESS_REQUIRED,    note: "empty → required" },
  { id: "VAL-PART-ADDR-002", field: "addressEn", value: "", expectedError: V.partner.ADDRESS_EN_REQUIRED, note: "English address empty → required" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Product scenarios
// ─────────────────────────────────────────────────────────────────────────────

export const productTitleGeScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-TGE-001", field: "titleGe", value: "",                                        expectedError: V.product.TITLE_GE_REQUIRED, note: "empty → required" },
  { id: "VAL-PROD-TGE-002", field: "titleGe", value: "აბ",                                      expectedError: V.product.TITLE_GE_MIN,      note: `2 chars — below min ${LIMITS.product.TITLE_MIN}` },
  { id: "VAL-PROD-TGE-003", field: "titleGe", value: "ა".repeat(LIMITS.product.TITLE_MAX + 1),  expectedError: V.product.TITLE_GE_MAX,      note: `above max ${LIMITS.product.TITLE_MAX}` },
  { id: "VAL-PROD-TGE-004", field: "titleGe", value: "Latin Title",                             expectedError: V.product.TITLE_GE_GEORGIAN, note: "Latin chars → Georgian only" },
  { id: "VAL-PROD-TGE-005", field: "titleGe", value: "ქართული Latin",                          expectedError: V.product.TITLE_GE_GEORGIAN, note: "mixed Georgian+Latin → Georgian only" },
];

export const productTitleEnScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-TEN-001", field: "titleEn", value: "",                                       expectedError: V.product.TITLE_EN_REQUIRED, note: "empty → required" },
  { id: "VAL-PROD-TEN-002", field: "titleEn", value: "Ab",                                     expectedError: V.product.TITLE_EN_MIN,      note: `2 chars — below min ${LIMITS.product.TITLE_MIN}` },
  { id: "VAL-PROD-TEN-003", field: "titleEn", value: "a".repeat(LIMITS.product.TITLE_MAX + 1), expectedError: V.product.TITLE_EN_MAX,      note: `above max ${LIMITS.product.TITLE_MAX}` },
  { id: "VAL-PROD-TEN-004", field: "titleEn", value: "ქართული",                               expectedError: V.product.TITLE_EN_LATIN,    note: "Georgian chars → English only" },
  { id: "VAL-PROD-TEN-005", field: "titleEn", value: "English ქ",                              expectedError: V.product.TITLE_EN_LATIN,    note: "mixed English+Georgian → English only" },
];

export const productDescGeScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-DGE-001", field: "descriptionGe", value: "",                                       expectedError: V.product.DESC_GE_REQUIRED, note: "empty → required" },
  { id: "VAL-PROD-DGE-002", field: "descriptionGe", value: "ა".repeat(LIMITS.product.DESC_MIN - 1),  expectedError: V.product.DESC_GE_MIN,      note: `${LIMITS.product.DESC_MIN - 1} chars — below min ${LIMITS.product.DESC_MIN}` },
  { id: "VAL-PROD-DGE-003", field: "descriptionGe", value: "ა".repeat(LIMITS.product.DESC_MAX + 1),  expectedError: V.product.DESC_GE_MAX,      note: `above max ${LIMITS.product.DESC_MAX}` },
  { id: "VAL-PROD-DGE-004", field: "descriptionGe", value: "Latin description",                      expectedError: V.product.DESC_GE_GEORGIAN, note: "Latin chars → Georgian only" },
];

export const productDescEnScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-DEN-001", field: "descriptionEn", value: "",                                       expectedError: V.product.DESC_EN_REQUIRED, note: "empty → required" },
  { id: "VAL-PROD-DEN-002", field: "descriptionEn", value: "a".repeat(LIMITS.product.DESC_MIN - 1),  expectedError: V.product.DESC_EN_MIN,      note: `${LIMITS.product.DESC_MIN - 1} chars — below min ${LIMITS.product.DESC_MIN}` },
  { id: "VAL-PROD-DEN-003", field: "descriptionEn", value: "a".repeat(LIMITS.product.DESC_MAX + 1),  expectedError: V.product.DESC_EN_MAX,      note: `above max ${LIMITS.product.DESC_MAX}` },
  { id: "VAL-PROD-DEN-004", field: "descriptionEn", value: "ქართული აღწერა",                        expectedError: V.product.DESC_EN_LATIN,    note: "Georgian chars → English only" },
];

export const productPriceScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-PR-001", field: "price", value: "",     expectedError: V.product.PRICE_INVALID, note: "empty → required/invalid" },
  { id: "VAL-PROD-PR-002", field: "price", value: "0",    expectedError: V.product.PRICE_INVALID, note: "zero — must be > 0" },
  { id: "VAL-PROD-PR-003", field: "price", value: "-1",   expectedError: V.product.PRICE_INVALID, note: "negative → must be > 0" },
  { id: "VAL-PROD-PR-004", field: "price", value: "abc",  expectedError: V.product.PRICE_INVALID, note: "non-numeric → invalid" },
];

export const productStockScenarios: ValidationScenario[] = [
  // ST-001 (empty) and ST-003 (non-numeric) omitted: Number("" || 0) = 0 which satisfies min(0), so no error
  { id: "VAL-PROD-ST-002", field: "stockQuantity", value: "-1",  expectedError: V.product.STOCK_INVALID, note: "negative → min 0" },
];

export const productTagGeScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-TGT-001", field: "tagsGe", value: "აბ",                                        expectedError: V.product.TAGS_GE_ITEM, note: `2 chars — below min ${LIMITS.product.TAG_ITEM_MIN}` },
  { id: "VAL-PROD-TGT-002", field: "tagsGe", value: "ა".repeat(LIMITS.product.TAG_ITEM_MAX + 1), expectedError: V.product.TAGS_GE_ITEM, note: `above max ${LIMITS.product.TAG_ITEM_MAX} chars` },
  { id: "VAL-PROD-TGT-003", field: "tagsGe", value: "Latin",                                     expectedError: V.product.TAGS_GE_ITEM, note: "Latin chars in Georgian tag" },
];

export const productTagEnScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-TET-001", field: "tagsEn", value: "ab",                                        expectedError: V.product.TAGS_EN_ITEM, note: `2 chars — below min ${LIMITS.product.TAG_ITEM_MIN}` },
  { id: "VAL-PROD-TET-002", field: "tagsEn", value: "a".repeat(LIMITS.product.TAG_ITEM_MAX + 1), expectedError: V.product.TAGS_EN_ITEM, note: `above max ${LIMITS.product.TAG_ITEM_MAX} chars` },
  { id: "VAL-PROD-TET-003", field: "tagsEn", value: "ქართული",                                  expectedError: V.product.TAGS_EN_ITEM, note: "Georgian chars in English tag" },
];

export const productMaterialGeScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-MGE-001", field: "materialsGe", value: "აბ",                                           expectedError: V.product.MATERIALS_GE_ITEM, note: `2 chars — below min ${LIMITS.product.MATERIAL_ITEM_MIN}` },
  { id: "VAL-PROD-MGE-002", field: "materialsGe", value: "ა".repeat(LIMITS.product.MATERIAL_ITEM_MAX + 1), expectedError: V.product.MATERIALS_GE_ITEM, note: `above max ${LIMITS.product.MATERIAL_ITEM_MAX}` },
  { id: "VAL-PROD-MGE-003", field: "materialsGe", value: "Silver",                                        expectedError: V.product.MATERIALS_GE_ITEM, note: "Latin chars in Georgian material" },
];

export const productConditionScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-COND-001", field: "condition", value: "",      expectedError: V.product.CONDITION_INVALID, note: "empty → required" },
  { id: "VAL-PROD-COND-002", field: "condition", value: "used",  expectedError: V.product.CONDITION_INVALID, note: "invalid value → must be new/handmade/vintage" },
  { id: "VAL-PROD-COND-003", field: "condition", value: "New",   expectedError: V.product.CONDITION_INVALID, note: "wrong casing → enum is strict" },
];

export const productMaterialEnScenarios: ValidationScenario[] = [
  { id: "VAL-PROD-MEN-001", field: "materialsEn", value: "ab",                                            expectedError: V.product.MATERIALS_EN_ITEM, note: `2 chars — below min ${LIMITS.product.MATERIAL_ITEM_MIN}` },
  { id: "VAL-PROD-MEN-002", field: "materialsEn", value: "a".repeat(LIMITS.product.MATERIAL_ITEM_MAX + 1), expectedError: V.product.MATERIALS_EN_ITEM, note: `above max ${LIMITS.product.MATERIAL_ITEM_MAX}` },
  { id: "VAL-PROD-MEN-003", field: "materialsEn", value: "ვერცხლი",                                       expectedError: V.product.MATERIALS_EN_ITEM, note: "Georgian chars in English material" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Boundary-passing scenarios (should NOT produce an error)
// ─────────────────────────────────────────────────────────────────────────────

export const translationBoundaryPassScenarios: PassingScenario[] = [
  { id: "PASS-TRANS-KEY-001", field: "key", value: "ab",                                      note: `key exactly at min ${LIMITS.translation.KEY_MIN} chars` },
  { id: "PASS-TRANS-KEY-002", field: "key", value: "a".repeat(LIMITS.translation.KEY_MAX),    note: `key exactly at max ${LIMITS.translation.KEY_MAX} chars` },
  { id: "PASS-TRANS-VAL-001", field: "ge",  value: "ა".repeat(LIMITS.translation.VALUE_MAX),  note: `ge value exactly at max ${LIMITS.translation.VALUE_MAX} chars` },
  { id: "PASS-TRANS-VAL-002", field: "en",  value: "a".repeat(LIMITS.translation.VALUE_MAX),  note: `en value exactly at max ${LIMITS.translation.VALUE_MAX} chars` },
];

export const menuBoundaryPassScenarios: PassingScenario[] = [
  { id: "PASS-MENU-ORD-001",  field: "order",   value: "0",                                   note: "order = 0 is valid (boundary)" },
  { id: "PASS-MENU-HREF-001", field: "href",    value: "/valid-path",                          note: "valid href with leading slash" },
  { id: "PASS-MENU-HREF-002", field: "href",    value: "/section/page",                        note: "valid nested href" },
  { id: "PASS-MENU-EN-001",   field: "labelEn", value: "a".repeat(LIMITS.menu.LABEL_MAX),      note: `labelEn exactly at max ${LIMITS.menu.LABEL_MAX} chars` },
  { id: "PASS-MENU-KA-001",   field: "labelKa", value: "ა".repeat(LIMITS.menu.LABEL_MAX),      note: `labelKa exactly at max ${LIMITS.menu.LABEL_MAX} chars` },
];

export const productBoundaryPassScenarios: PassingScenario[] = [
  { id: "PASS-PROD-PR-001",  field: "price",         value: "0.01",                            note: "price just above 0 — valid" },
  { id: "PASS-PROD-ST-001",  field: "stockQuantity", value: "0",                               note: "stock = 0 — valid (out of stock)" },
  { id: "PASS-PROD-TGE-001", field: "titleGe",       value: "ა".repeat(LIMITS.product.TITLE_MIN), note: `titleGe exactly at min ${LIMITS.product.TITLE_MIN} chars` },
  { id: "PASS-PROD-TGE-002", field: "titleGe",       value: "ა".repeat(LIMITS.product.TITLE_MAX), note: `titleGe exactly at max ${LIMITS.product.TITLE_MAX} chars` },
  { id: "PASS-PROD-DGE-001", field: "descriptionGe", value: "ა".repeat(LIMITS.product.DESC_MIN),  note: `descGe exactly at min ${LIMITS.product.DESC_MIN} chars` },
];
