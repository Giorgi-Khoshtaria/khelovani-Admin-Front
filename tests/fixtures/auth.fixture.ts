import { test as base, type Page } from "@playwright/test";
import * as path from "path";

type MyFixtures = {
  asAdmin: Page;
  asOrganizer: Page;
};
export const test = base.extend<MyFixtures>({
  asAdmin: async ({ browser }, provide) => {
    const context = await browser.newContext({
      storageState: path.resolve(process.cwd(), "tests/.auth/admin.json"),
    });
    const page = await context.newPage();
    await provide(page);
    await context.close();
  },
  asOrganizer: async ({ browser }, provide) => {
    const context = await browser.newContext({
      storageState: path.resolve(process.cwd(), "tests/.auth/organizer.json"),
    });

    const page = await context.newPage();
    await provide(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
