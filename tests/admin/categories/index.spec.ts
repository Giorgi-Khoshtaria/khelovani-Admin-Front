import test from "@playwright/test";
import { categoriesListingTests } from "./suites/listing.spec";
import { categoriesAddTests } from "./suites/add.spec";
import { categoriesInlineEditTests } from "./suites/inlineEdit.spec";
import { categoriesDeleteTests } from "./suites/delete.spec";
import { categoriesAccessTests } from "./suites/access.spec";

test.describe("Admin — Categories", () => {
  categoriesListingTests();
  categoriesAddTests();
  categoriesInlineEditTests();
  categoriesDeleteTests();
  categoriesAccessTests();
});
