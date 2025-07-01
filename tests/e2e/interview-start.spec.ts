import test, { expect } from "@playwright/test";

test("Interview start", async ({ page }) => {
  await page.goto("http://localhost:3000/interview");
  await expect(
    page.getByRole("button", { name: "Start Random Interview" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Start Random Interview" }).click();
  await expect(
    page.getByRole("button", { name: "Run Testcases" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("textbox", { name: "Your message here" }).click();
  await page
    .getByRole("combobox")
    .filter({ hasText: "Python (3.8.1)" })
    .click();
});
