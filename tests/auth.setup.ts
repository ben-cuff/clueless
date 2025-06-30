import { expect, test as setup } from "@playwright/test";
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

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(`${process.env.BASE_URL}/login`);

  await page
    .getByRole("textbox", { name: "Username:" })
    .fill(process.env.TEST_USERNAME || "");
  await page
    .getByRole("textbox", { name: "Password:" })
    .fill(process.env.TEST_PASSWORD || "");
  await page.getByRole("button", { name: "Sign in" }).click();

  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(`${process.env.BASE_URL}/`);
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await page
    .getByRole("banner")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await expect(page.getByRole("menuitem", { name: "Settings" })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
