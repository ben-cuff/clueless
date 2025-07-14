import { expect, Page } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const username = `user_${Math.random().toString(36).substring(2, 10)}`;
const password = `Passw0rd!${Math.random().toString(36).substring(2, 8)}`;

async function doRegister(page: Page) {
  await page.goto(`/register`);

  await page.getByRole("textbox", { name: "Username:" }).fill(username);
  await page
    .getByRole("textbox", { name: "Password:", exact: true })
    .fill(password);
  await page.getByRole("textbox", { name: "Confirm Password:" }).fill(password);
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
  await page.getByRole("textbox", { name: "Username:" }).fill(username);
  await page.getByRole("textbox", { name: "Password:" }).fill(password);
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
