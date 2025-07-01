import { expect, Page } from "@playwright/test";
import dotenv from "dotenv";

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

async function doLogin(page: Page) {
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
}

export { doLogin, doRegister };
