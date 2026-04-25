import { test } from "@playwright/test";
import {
  callApiAs,
  expectForbidden,
  expectUnauthorized,
} from "../../../helpers/security.helper";

const OTHER_PARTNER_ID = "000000000000000000000001";
const OTHER_PRODUCT_ID = "000000000000000000000002";

export const ownershipTests = () => {
  test.describe("Organizer — Products › Ownership (API-level)", () => {
    test("GET partner products list of another partner → 403/404", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: `/api/products/partner/${OTHER_PARTNER_ID}`,
      });
      expectForbidden(res.status);
    });

    test("POST product to another partner → 403/404", async () => {
      const res = await callApiAs("organizer", {
        method: "POST",
        url: `/api/products/partner/${OTHER_PARTNER_ID}`,
        data: { titleEn: "injected" },
      });
      expectForbidden(res.status);
    });

    test("PATCH another partner's product → 403/404", async () => {
      const res = await callApiAs("organizer", {
        method: "PATCH",
        url: `/api/products/${OTHER_PRODUCT_ID}`,
        data: { isShown: false },
      });
      expectForbidden(res.status);
    });

    test("DELETE another partner's product → 403/404", async () => {
      const res = await callApiAs("organizer", {
        method: "DELETE",
        url: `/api/products/${OTHER_PRODUCT_ID}`,
      });
      expectForbidden(res.status);
    });

    test("GET partner products without token → 401", async () => {
      const res = await callApiAs(null, {
        method: "GET",
        url: `/api/products/partner/${OTHER_PARTNER_ID}`,
      });
      expectUnauthorized(res.status);
    });

    test("POST product without token → 401", async () => {
      const res = await callApiAs(null, {
        method: "POST",
        url: `/api/products/partner/${OTHER_PARTNER_ID}`,
        data: { titleEn: "noauth" },
      });
      expectUnauthorized(res.status);
    });

    test("malformed JWT on any product endpoint → 401", async () => {
      const res = await callApiAs(null, {
        method: "GET",
        url: `/api/products/partner/${OTHER_PARTNER_ID}`,
        headers: { Authorization: "Bearer not.a.real.token" },
      });
      expectUnauthorized(res.status);
    });
  });
};
