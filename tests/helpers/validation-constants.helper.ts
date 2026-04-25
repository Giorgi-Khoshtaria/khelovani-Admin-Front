/**
 * Validation constants: messages (V), field limits (LIMITS), regex rules (REGEX),
 * protected route lists, shared types, and the repeat() utility.
 *
 * These mirror the Zod schemas in src/validations/ exactly.
 */

// ─────────────────────────────────────────────────────────────────────────────
// V — validation messages
// ─────────────────────────────────────────────────────────────────────────────

export const V = {

  login: {
    EMAIL_REQUIRED:    "ელ-ფოსტა აუცილებელია",
    EMAIL_MAX:         "ელ-ფოსტა არ უნდა აღემატებოდეს 100 სიმბოლოს",
    EMAIL_FORMAT:      "არასწორი ელ-ფოსტის ფორმატი",
    PASSWORD_REQUIRED: "პაროლი აუცილებელია",
  },

  menu: {
    LABEL_EN_REQUIRED: "ინგლისური სახელი სავალდებულოა",
    LABEL_EN_MAX:      "ინგლისური სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს",
    LABEL_EN_LATIN:    "ინგლისური სახელი მხოლოდ ლათინური ასოებით უნდა იყოს",
    LABEL_KA_REQUIRED: "ქართული სახელი სავალდებულოა",
    LABEL_KA_MAX:      "ქართული სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს",
    LABEL_KA_GEORGIAN: "ქართული სახელი მხოლოდ ქართული ასოებით უნდა იყოს",
    HREF_REQUIRED:     "ლინკი სავალდებულოა",
    HREF_MAX:          "ლინკი არ უნდა აღემატებოდეს 100 სიმბოლოს",
    HREF_SLASH:        "ლინკი უნდა იწყებოდეს '/' სიმბოლოთი",
    HREF_FORMAT:       "არასწორი ლინკის ფორმატი",
    ORDER_MIN:         "რიგითობა უნდა იყოს 0 ან მეტი",
  },

  translation: {
    KEY_REQUIRED:    "გასაღები სავალდებულოა",
    KEY_MIN_LENGTH:  "გასაღები უნდა იყოს მინიმუმ 2 სიმბოლო",
    KEY_MAX_LENGTH:  "გასაღები უნდა იყოს მაქსიმუმ 100 სიმბოლო",
    GE_REQUIRED:     "ქართული თარგმანი სავალდებულოა",
    GE_MAX_LENGTH:   "თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს",
    GE_XSS:          "აღმოჩენილია არასასურველი სიმბოლოები (XSS)",
    EN_REQUIRED:     "ინგლისური თარგმანი სავალდებულოა",
    EN_MAX_LENGTH:   "თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს",
    EN_XSS:          "აღმოჩენილია არასასურველი სიმბოლოები (XSS)",
    VALUE_MAX_LENGTH:"თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს",
  },

  partner: {
    COMPANY_NAME_GE_REQUIRED: "კომპანიის სახელი სავალდებულოა",
    COMPANY_NAME_EN_REQUIRED: "კომპანიის სახელი (EN) სავალდებულოა",
    ID_CODE_REQUIRED:         "საიდენტიფიკაციო კოდი სავალდებულოა",
    ID_CODE_LENGTH:           "კოდი უნდა იყოს 9 ნიშნა",
    CONTACT_PERSON_REQUIRED:  "საკონტაქტო პირი სავალდებულოა",
    CITY_REQUIRED:            "ქალაქი სავალდებულოა",
    PHONE_REQUIRED:           "ტელეფონი სავალდებულოა",
    EMAIL_REQUIRED:           "ელ-ფოსტა აუცილებელია",
    EMAIL_FORMAT:             "არასწორი ელ-ფოსტის ფორმატი",
    ADDRESS_REQUIRED:         "მისამართი სავალდებულოა",
    ADDRESS_EN_REQUIRED:      "მისამართი (ინგლისურად) სავალდებულოა",
  },

  profile: {
    PHONE_REQUIRED:        "ტელეფონი სავალდებულოა",
    COMPANY_NAME_REQUIRED: "კომპანიის სახელი სავალდებულოა",
  },

  product: {
    TITLE_GE_REQUIRED:  "ქართული სათაური სავალდებულოა",
    TITLE_GE_MIN:       "სათაური უნდა იყოს მინიმუმ 3 სიმბოლო",
    TITLE_GE_MAX:       "სათაური არ უნდა აღემატებოდეს 100 სიმბოლოს",
    TITLE_GE_GEORGIAN:  "სათაური უნდა შეიცავდეს მხოლოდ ქართულ ასოებს",
    TITLE_EN_REQUIRED:  "ინგლისური სათაური სავალდებულოა",
    TITLE_EN_MIN:       "Title must be at least 3 characters",
    TITLE_EN_MAX:       "Title must not exceed 100 characters",
    TITLE_EN_LATIN:     "Title must contain only English characters",
    DESC_GE_REQUIRED:   "ქართული აღწერა სავალდებულოა",
    DESC_GE_MIN:        "აღწერა უნდა იყოს მინიმუმ 10 სიმბოლო",
    DESC_GE_MAX:        "აღწერა არ უნდა აღემატებოდეს 2000 სიმბოლოს",
    DESC_GE_GEORGIAN:   "აღწერა უნდა შეიცავდეს მხოლოდ ქართულ ასოებს",
    DESC_EN_REQUIRED:   "ინგლისური აღწერა სავალდებულოა",
    DESC_EN_MIN:        "Description must be at least 10 characters",
    DESC_EN_MAX:        "Description must not exceed 2000 characters",
    DESC_EN_LATIN:      "Description must contain only English characters",
    CATEGORY_INVALID:   "აირჩიეთ სწორი კატეგორია",
    PRICE_INVALID:      "ფასი უნდა იყოს სწორი ციფრი (0-ზე მეტი)",
    STOCK_INVALID:      "მარაგი უნდა იყოს სწორი ციფრი (0 ან მეტი)",
    TAGS_GE_ITEM:       "არასწორი ტეგი (3-30 სიმბოლო, მხოლოდ ქართული)",
    TAGS_GE_MIN:        "მინიმუმ 1 ტეგი სავალდებულოა",
    TAGS_GE_MAX:        "მაქსიმუმ 10 ტეგია ნებადართული",
    TAGS_EN_ITEM:       "Invalid tag (3-30 chars, only English)",
    TAGS_EN_MIN:        "Minimum 1 English tag is required",
    TAGS_EN_MAX:        "Maximum 10 tags allowed",
    MATERIALS_GE_ITEM:  "არასწორი მასალა (3-30 სიმბოლო, მხოლოდ ქართული)",
    MATERIALS_GE_MIN:   "მინიმუმ 1 მასალა სავალდებულოა",
    MATERIALS_GE_MAX:   "მაქსიმუმ 10 მასალაა ნებადართული",
    MATERIALS_EN_ITEM:  "Invalid material (3-30 chars, only English)",
    MATERIALS_EN_MIN:   "Minimum 1 English material is required",
    MATERIALS_EN_MAX:   "Maximum 10 materials allowed",
    CONDITION_REQUIRED: "მდგომარეობა სავალდებულოა",
    CONDITION_INVALID:  "მდგომარეობა სავალდებულოა / მდგომარეობა არასწორია",
    IMAGES_MIN:         "აუცილებელია მინიმუმ 1 სურათი",
    IMAGES_MAX:         "მაქსიმუმ 5 სურათი",
    SHIPPING_PRICE_MIN: "ტრანსპორტირების ფასი უნდა იყოს 0 ან მეტი",
    WEIGHT_MIN:         "წონა უნდა იყოს 0 ან მეტი",
  },

  role: {
    NAME_REQUIRED: "სავალდებულოა",
  },

} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LIMITS — field character limits (mirrors schema .min()/.max() values)
// ─────────────────────────────────────────────────────────────────────────────

export const LIMITS = {
  login: {
    EMAIL_MAX: 100,
  },
  menu: {
    LABEL_MAX: 100,
    HREF_MAX:  100,
    ORDER_MIN: 0,
  },
  translation: {
    KEY_MIN:   2,
    KEY_MAX:   100,
    VALUE_MAX: 200,
  },
  partner: {
    ID_CODE_LENGTH: 9,
  },
  product: {
    TITLE_MIN:          3,
    TITLE_MAX:          100,
    DESC_MIN:           10,
    DESC_MAX:           2000,
    PRICE_MIN:          0.01,
    STOCK_MIN:          0,
    TAG_ITEM_MIN:       3,
    TAG_ITEM_MAX:       30,
    TAGS_MIN:           1,
    TAGS_MAX:           10,
    MATERIAL_ITEM_MIN:  3,
    MATERIAL_ITEM_MAX:  30,
    MATERIALS_MIN:      1,
    MATERIALS_MAX:      10,
    IMAGES_MIN:         1,
    IMAGES_MAX:         5,
    SHIPPING_MIN:       0,
    WEIGHT_MIN:         0,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// REGEX — mirrors schema .regex() rules
// ─────────────────────────────────────────────────────────────────────────────

export const REGEX = {
  GEORGIAN: /^[ა-ჰ0-9\s.,/\\\-()!?:;$%&*#@]+$/,
  ENGLISH:  /^[a-zA-Z0-9\s.,/\\\-()!?:;$%&*#@]+$/,
  MENU_EN:  /^[a-zA-Z0-9\s\-_]+$/,
  MENU_KA:  /^[ა-ჰ0-9\s\-_]+$/,
  HREF:     /^\/[a-zA-Z0-9/\-._]*$/,
  XSS:      /<script|iframe|object|embed|base|style|meta|link|on\w+\s*=|javascript:/i,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Route constants
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_PROTECTED_ROUTES = ["/menu", "/roles", "/translations", "/partners", "/export"] as const;
export const ADMIN_ONLY_ROUTES      = ["/menu", "/roles", "/translations"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationScenario {
  id: string;
  field: string;
  value: string;
  expectedError: string;
  note: string;
}

export interface PassingScenario {
  id: string;
  field: string;
  value: string;
  note: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

export const repeat = (char: string, times: number) => char.repeat(times);
