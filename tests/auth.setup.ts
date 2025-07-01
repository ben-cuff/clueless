import { expect, Page, test } from "@playwright/test";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

// Ensure auth directory exists
(async () => {
  const authDir = path.dirname(authFile);
  try {
    await fs.mkdir(authDir, { recursive: true });
  } catch (error) {
    console.error(`Failed to create auth directory: ${error}`);
  }
})();

dotenv.config();

async function doRegister(page: Page) {
  await page.goto(`/register`);
  await page
    .getByRole("textbox", { name: "Username:" })
    .fill(process.env.TEST_USERNAME || "");
  await page
    .getByRole("textbox", { name: "Password:", exact: true })
    .fill(process.env.TEST_PASSWORD || "");
  await page
    .getByRole("textbox", { name: "Confirm Password:" })
    .fill(process.env.TEST_PASSWORD || "");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page).toHaveURL(`/`);
  await page
    .getByRole("banner")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await expect(page.getByRole("menuitem", { name: "Settings" })).toBeVisible();
}

test("register-and-authenticate", async ({ page }) => {
  await doRegister(page);
  await page.goto(`/login`);
  await page
    .getByRole("textbox", { name: "Username:" })
    .fill(process.env.TEST_USERNAME || "");
  await page
    .getByRole("textbox", { name: "Password:" })
    .fill(process.env.TEST_PASSWORD || "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(`/`);
  await page
    .getByRole("banner")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await expect(page.getByRole("menuitem", { name: "Settings" })).toBeVisible();
  await page.context().storageState({ path: authFile });
});
