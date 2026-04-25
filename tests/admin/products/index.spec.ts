import test from "@playwright/test";
import { productsAccessTests } from "./suites/access.spec";
import { productsListTests } from "./suites/list.spec";
import { productsPartnerListingTests } from "./suites/listing.partner.spec";
import { productsFiltersTests } from "./suites/filters.spec";
import { productsPaginationTests } from "./suites/pagination.spec";
import { productsRowActionsTests } from "./suites/row-actions.spec";
import { productsDetailsTests } from "./suites/details.spec";
import { productsVisibilityTests } from "./suites/visibility.spec";
import { productsDeleteTests } from "./suites/delete.spec";
import { productsCrossPartnerTests } from "./suites/cross-partner.spec";
import { productsErrorStatesTests } from "./suites/error-states.spec";

test.describe("Admin — Products", () => {
  productsAccessTests();
  productsListTests();
  productsPartnerListingTests();
  productsFiltersTests();
  productsPaginationTests();
  productsRowActionsTests();
  productsDetailsTests();
  productsVisibilityTests();
  productsDeleteTests();
  productsCrossPartnerTests();
  productsErrorStatesTests();
});
