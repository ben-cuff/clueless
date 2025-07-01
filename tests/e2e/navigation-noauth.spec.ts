import test, { expect } from "@playwright/test";

test("navigate-to-interview-logged-out", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page
    .getByRole("banner")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await page.getByRole("menuitem", { name: "Sign Out" }).click();
  await page.waitForTimeout(2000);
  page.once("dialog", (dialog) => {
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole("link", { name: "Interview" }).click();
  await expect(
    page.locator("div").filter({ hasText: "An AI integrated interview" }).nth(1)
  ).toBeVisible();
  await expect(page).toHaveURL(/\/(\?error=unauthenticated)?$/);
});

test("navigate-to-login", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.goto("http://localhost:3000/");
  await page
    .getByRole("banner")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await page.getByRole("menuitem", { name: "Sign Out" }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^Username:Password:Sign In$/ })
  ).toBeVisible();

  await expect(page).toHaveURL("/login");
});

test("navigate-to-register", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page
    .getByRole("banner")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await page.getByRole("menuitem", { name: "Sign Out" }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Username:Password:Confirm Password:Register$/ })
  ).toBeVisible();
  await expect(page).toHaveURL("/register");
});

test("navigate-between-register-and-login", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page
    .getByRole("banner")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await page.getByRole("menuitem", { name: "Sign Out" }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page).toHaveURL("/register");
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page).toHaveURL("/login");
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page).toHaveURL("/register");
});
